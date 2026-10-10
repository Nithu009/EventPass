package com.eventpass.service;

import com.eventpass.common.BusinessException;
import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.BookingDto;
import com.eventpass.dto.CreateBookingRequest;
import com.eventpass.model.*;
import com.eventpass.model.enums.BookingStatus;
import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatLockRepository seatLockRepository;
    private final EventSeatRepository eventSeatRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final PricingEngineService pricingEngineService;

    public BookingService(BookingRepository bookingRepository,
                          SeatLockRepository seatLockRepository,
                          EventSeatRepository eventSeatRepository,
                          EventRepository eventRepository,
                          VenueRepository venueRepository,
                          UserRepository userRepository,
                          PricingEngineService pricingEngineService) {
        this.bookingRepository = bookingRepository;
        this.seatLockRepository = seatLockRepository;
        this.eventSeatRepository = eventSeatRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.pricingEngineService = pricingEngineService;
    }

    @Transactional
    public BookingDto createBooking(CreateBookingRequest request, String userId) {
        List<SeatLock> locks = seatLockRepository.findByLockToken(request.getLockToken());
        if (locks.isEmpty()) {
            throw new BusinessException("Reservation lock has expired or does not exist");
        }

        SeatLock firstLock = locks.get(0);
        if (!firstLock.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized to convert this reservation");
        }

        if (firstLock.getExpiresAt().isBefore(Instant.now())) {
            throw new BusinessException("Reservation lock expired. Please select seats again.");
        }

        String eventId = firstLock.getEventId();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        int totalSeats = (int) eventSeatRepository.countByEventId(eventId);
        int bookedOrLocked = (int) eventSeatRepository.countByEventIdAndStatus(eventId, EventSeatStatus.BOOKED)
                + (int) eventSeatRepository.countByEventIdAndStatus(eventId, EventSeatStatus.LOCKED);

        List<BookingItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (SeatLock lock : locks) {
            String seatCode = lock.getSeatCode();
            EventSeat seat = eventSeatRepository.findByEventIdAndSeatCode(eventId, seatCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + seatCode + " not found"));

            BigDecimal priceSnapshot = pricingEngineService.calculateDynamicPrice(
                    event, seat.getCategory(), totalSeats, bookedOrLocked
            );

            items.add(new BookingItem(
                    seat.getId(),
                    seat.getSeatCode(),
                    seat.getRowLabel(),
                    seat.getSeatNumber(),
                    seat.getCategory(),
                    priceSnapshot
            ));
            subtotal = subtotal.add(priceSnapshot);
        }

        // 5% convenience fee
        BigDecimal serviceFee = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(serviceFee);

        String bookingReference = "EP-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = new Booking(
                bookingReference,
                userId,
                eventId,
                items,
                subtotal,
                serviceFee,
                totalAmount,
                firstLock.getExpiresAt()
        );

        Booking savedBooking = bookingRepository.save(booking);
        return enrichBookingDto(savedBooking);
    }

    public List<BookingDto> getUserBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookings.stream().map(this::enrichBookingDto).toList();
    }

    public BookingDto getBookingById(String bookingId, String userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!isAdmin && !booking.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized to view this booking");
        }

        return enrichBookingDto(booking);
    }

    public List<BookingDto> getAllBookingsForAdmin() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(this::enrichBookingDto).toList();
    }

    private BookingDto enrichBookingDto(Booking booking) {
        BookingDto dto = BookingDto.fromEntity(booking);

        userRepository.findById(booking.getUserId()).ifPresent(user -> {
            dto.setUserEmail(user.getEmail());
            dto.setUserName(user.getFullName());
        });

        eventRepository.findById(booking.getEventId()).ifPresent(event -> {
            dto.setEventTitle(event.getTitle());
            dto.setEventStartTime(event.getStartTime());
            venueRepository.findById(event.getVenueId()).ifPresent(v -> dto.setVenueName(v.getName()));
        });

        return dto;
    }
}
