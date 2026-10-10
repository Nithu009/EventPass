package com.eventpass.service;

import com.eventpass.common.BusinessException;
import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.SeatDto;
import com.eventpass.dto.SeatLayoutDto;
import com.eventpass.dto.SeatLockRequest;
import com.eventpass.dto.SeatLockResponse;
import com.eventpass.model.Event;
import com.eventpass.model.EventSeat;
import com.eventpass.model.SeatLock;
import com.eventpass.model.Venue;
import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.repository.EventRepository;
import com.eventpass.repository.EventSeatRepository;
import com.eventpass.repository.SeatLockRepository;
import com.eventpass.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class SeatService {

    public static final int LOCK_DURATION_SECONDS = 480; // 8 minutes TTL

    private final EventSeatRepository eventSeatRepository;
    private final SeatLockRepository seatLockRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final PricingEngineService pricingEngineService;

    public SeatService(EventSeatRepository eventSeatRepository,
                       SeatLockRepository seatLockRepository,
                       EventRepository eventRepository,
                       VenueRepository venueRepository,
                       PricingEngineService pricingEngineService) {
        this.eventSeatRepository = eventSeatRepository;
        this.seatLockRepository = seatLockRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
        this.pricingEngineService = pricingEngineService;
    }

    /**
     * Reconcile and release locks that have exceeded their 8-minute TTL.
     */
    public void cleanupExpiredLocks() {
        Instant now = Instant.now();
        List<SeatLock> expiredLocks = seatLockRepository.findByExpiresAtBefore(now);
        for (SeatLock lock : expiredLocks) {
            eventSeatRepository.findByEventIdAndSeatCode(lock.getEventId(), lock.getSeatCode()).ifPresent(seat -> {
                if (seat.getStatus() == EventSeatStatus.LOCKED) {
                    seat.setStatus(EventSeatStatus.AVAILABLE);
                    eventSeatRepository.save(seat);
                }
            });
            seatLockRepository.delete(lock);
        }
    }

    /**
     * Retrieve seating layout for an event with real-time availability and dynamic prices.
     */
    public SeatLayoutDto getSeatLayout(String eventId, String currentUserId) {
        cleanupExpiredLocks();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
        Venue venue = venueRepository.findById(event.getVenueId()).orElse(null);

        List<EventSeat> seats = eventSeatRepository.findByEventIdOrderByRowLabelAscSeatNumberAsc(eventId);
        int totalSeats = seats.size();
        int bookedCount = 0;
        int lockedCount = 0;
        int availableCount = 0;

        for (EventSeat s : seats) {
            if (s.getStatus() == EventSeatStatus.BOOKED) bookedCount++;
            else if (s.getStatus() == EventSeatStatus.LOCKED) lockedCount++;
            else availableCount++;
        }

        // Active locks for this user to identify which seats they have reserved
        Set<String> userLockedSeatCodes = new HashSet<>();
        if (currentUserId != null) {
            List<SeatLock> userLocks = seatLockRepository.findByUserIdAndActiveIsTrueAndExpiresAtAfter(currentUserId, Instant.now());
            for (SeatLock lock : userLocks) {
                if (lock.getEventId().equals(eventId)) {
                    userLockedSeatCodes.add(lock.getSeatCode());
                }
            }
        }

        int bookedOrLocked = bookedCount + lockedCount;
        List<SeatDto> seatDtos = new ArrayList<>();
        for (EventSeat seat : seats) {
            BigDecimal dynamicPrice = pricingEngineService.calculateDynamicPrice(event, seat.getCategory(), totalSeats, bookedOrLocked);
            boolean isLockedByUser = userLockedSeatCodes.contains(seat.getSeatCode());
            seatDtos.add(SeatDto.fromEntity(seat, dynamicPrice, isLockedByUser));
        }

        SeatLayoutDto layout = new SeatLayoutDto();
        layout.setEventId(eventId);
        layout.setEventTitle(event.getTitle());
        layout.setVenueName(venue != null ? venue.getName() : "Main Arena");
        layout.setTotalRows(venue != null ? venue.getTotalRows() : 10);
        layout.setTotalColumns(venue != null ? venue.getTotalColumns() : 10);
        layout.setTotalSeats(totalSeats);
        layout.setAvailableCount(availableCount);
        layout.setLockedCount(lockedCount);
        layout.setBookedCount(bookedCount);
        layout.setSeats(seatDtos);

        Map<String, Object> pricingBreakdown = new HashMap<>();
        pricingBreakdown.put("standard", pricingEngineService.calculateDynamicPrice(event, com.eventpass.model.enums.SeatCategory.STANDARD, totalSeats, bookedOrLocked));
        pricingBreakdown.put("premium", pricingEngineService.calculateDynamicPrice(event, com.eventpass.model.enums.SeatCategory.PREMIUM, totalSeats, bookedOrLocked));
        pricingBreakdown.put("vip", pricingEngineService.calculateDynamicPrice(event, com.eventpass.model.enums.SeatCategory.VIP, totalSeats, bookedOrLocked));
        layout.setPricingBreakdown(pricingBreakdown);

        return layout;
    }

    /**
     * Atomically lock up to 6 seats for 8 minutes.
     */
    @Transactional
    public SeatLockResponse lockSeats(String eventId, SeatLockRequest request, String userId) {
        if (request.getSeatCodes() == null || request.getSeatCodes().isEmpty()) {
            throw new BusinessException("At least one seat code must be selected");
        }
        if (request.getSeatCodes().size() > 6) {
            throw new BusinessException("Cannot reserve more than 6 seats in a single reservation");
        }

        cleanupExpiredLocks();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        List<EventSeat> seatsToLock = new ArrayList<>();
        BigDecimal estimatedTotal = BigDecimal.ZERO;
        int totalSeats = (int) eventSeatRepository.countByEventId(eventId);
        int bookedOrLocked = (int) eventSeatRepository.countByEventIdAndStatus(eventId, EventSeatStatus.BOOKED)
                + (int) eventSeatRepository.countByEventIdAndStatus(eventId, EventSeatStatus.LOCKED);

        for (String seatCode : request.getSeatCodes()) {
            EventSeat seat = eventSeatRepository.findByEventIdAndSeatCode(eventId, seatCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + seatCode + " not found for event"));

            if (seat.getStatus() == EventSeatStatus.BOOKED) {
                throw new BusinessException("Seat " + seatCode + " is already booked");
            }
            if (seat.getStatus() == EventSeatStatus.LOCKED) {
                // Check if held by another active lock
                Optional<SeatLock> existingLock = seatLockRepository.findByEventIdAndSeatCodeAndActiveIsTrueAndExpiresAtAfter(
                        eventId, seatCode, Instant.now()
                );
                if (existingLock.isPresent() && !existingLock.get().getUserId().equals(userId)) {
                    throw new BusinessException("Seat " + seatCode + " is currently held by another attendee");
                }
            }

            BigDecimal dynamicPrice = pricingEngineService.calculateDynamicPrice(event, seat.getCategory(), totalSeats, bookedOrLocked);
            estimatedTotal = estimatedTotal.add(dynamicPrice);
            seatsToLock.add(seat);
        }

        // Shared lock token for this transaction
        String lockToken = "LCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis() % 10000;
        Instant expiresAt = Instant.now().plusSeconds(LOCK_DURATION_SECONDS);

        for (EventSeat seat : seatsToLock) {
            SeatLock lock = new SeatLock(eventId, seat.getId(), seat.getSeatCode(), userId, lockToken, expiresAt);
            seatLockRepository.save(lock);

            seat.setStatus(EventSeatStatus.LOCKED);
            eventSeatRepository.save(seat);
        }

        return new SeatLockResponse(
                lockToken,
                eventId,
                request.getSeatCodes(),
                expiresAt,
                LOCK_DURATION_SECONDS,
                estimatedTotal
        );
    }

    /**
     * Release locked seats voluntarily.
     */
    @Transactional
    public void releaseSeats(String lockToken, String userId) {
        List<SeatLock> locks = seatLockRepository.findByLockToken(lockToken);
        if (locks.isEmpty()) {
            return;
        }

        for (SeatLock lock : locks) {
            if (lock.getUserId().equals(userId)) {
                eventSeatRepository.findByEventIdAndSeatCode(lock.getEventId(), lock.getSeatCode()).ifPresent(seat -> {
                    if (seat.getStatus() == EventSeatStatus.LOCKED) {
                        seat.setStatus(EventSeatStatus.AVAILABLE);
                        eventSeatRepository.save(seat);
                    }
                });
                seatLockRepository.delete(lock);
            }
        }
    }
}
