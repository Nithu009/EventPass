package com.eventpass.service;

import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.CreateEventRequest;
import com.eventpass.dto.EventDto;
import com.eventpass.model.Event;
import com.eventpass.model.EventSeat;
import com.eventpass.model.Venue;
import com.eventpass.model.VenueSeat;
import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.model.enums.EventStatus;
import com.eventpass.model.enums.SeatCategory;
import com.eventpass.repository.EventRepository;
import com.eventpass.repository.EventSeatRepository;
import com.eventpass.repository.VenueRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventSeatRepository eventSeatRepository;
    private final VenueRepository venueRepository;
    private final PricingEngineService pricingEngineService;

    public EventService(EventRepository eventRepository,
                        EventSeatRepository eventSeatRepository,
                        VenueRepository venueRepository,
                        PricingEngineService pricingEngineService) {
        this.eventRepository = eventRepository;
        this.eventSeatRepository = eventSeatRepository;
        this.venueRepository = venueRepository;
        this.pricingEngineService = pricingEngineService;
    }

    public List<EventDto> getPublishedEvents(String keyword, String category) {
        List<Event> events;
        if (category != null && !category.isBlank()) {
            events = eventRepository.findByStatusAndCategory(EventStatus.PUBLISHED, category);
        } else if (keyword != null && !keyword.isBlank()) {
            Page<Event> page = eventRepository.searchPublishedByKeyword(keyword, PageRequest.of(0, 50));
            events = page.getContent();
        } else {
            Page<Event> page = eventRepository.findByStatusOrderByStartTimeAsc(EventStatus.PUBLISHED, PageRequest.of(0, 50));
            events = page.getContent();
        }

        // Cache venue names
        Map<String, Venue> venueMap = venueRepository.findAll().stream()
                .collect(Collectors.toMap(Venue::getId, v -> v, (a, b) -> a));

        return events.stream().map(event -> {
            Venue venue = venueMap.get(event.getVenueId());
            String venueName = venue != null ? venue.getName() : "TBD";
            String venueCity = venue != null ? venue.getCity() : "";
            int totalSeats = (int) eventSeatRepository.countByEventId(event.getId());
            int availableSeats = (int) eventSeatRepository.countByEventIdAndStatus(event.getId(), EventSeatStatus.AVAILABLE);
            
            EventDto dto = EventDto.fromEntity(event, venueName, venueCity, totalSeats, availableSeats);

            // Compute current dynamic tier pricing
            int lockedOrBooked = totalSeats - availableSeats;
            dto.setCurrentStandardPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.STANDARD, totalSeats, lockedOrBooked));
            dto.setCurrentPremiumPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.PREMIUM, totalSeats, lockedOrBooked));
            dto.setCurrentVipPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.VIP, totalSeats, lockedOrBooked));
            return dto;
        }).toList();
    }

    public EventDto getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        Venue venue = venueRepository.findById(event.getVenueId()).orElse(null);
        String venueName = venue != null ? venue.getName() : "TBD";
        String venueCity = venue != null ? venue.getCity() : "";

        int totalSeats = (int) eventSeatRepository.countByEventId(event.getId());
        int availableSeats = (int) eventSeatRepository.countByEventIdAndStatus(event.getId(), EventSeatStatus.AVAILABLE);

        EventDto dto = EventDto.fromEntity(event, venueName, venueCity, totalSeats, availableSeats);
        int lockedOrBooked = totalSeats - availableSeats;
        dto.setCurrentStandardPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.STANDARD, totalSeats, lockedOrBooked));
        dto.setCurrentPremiumPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.PREMIUM, totalSeats, lockedOrBooked));
        dto.setCurrentVipPrice(pricingEngineService.calculateDynamicPrice(event, SeatCategory.VIP, totalSeats, lockedOrBooked));

        return dto;
    }

    public List<EventDto> getAllEventsForAdmin() {
        List<Event> events = eventRepository.findAll();
        Map<String, Venue> venueMap = venueRepository.findAll().stream()
                .collect(Collectors.toMap(Venue::getId, v -> v, (a, b) -> a));

        return events.stream().map(event -> {
            Venue venue = venueMap.get(event.getVenueId());
            String venueName = venue != null ? venue.getName() : "TBD";
            String venueCity = venue != null ? venue.getCity() : "";
            int totalSeats = (int) eventSeatRepository.countByEventId(event.getId());
            int availableSeats = (int) eventSeatRepository.countByEventIdAndStatus(event.getId(), EventSeatStatus.AVAILABLE);
            return EventDto.fromEntity(event, venueName, venueCity, totalSeats, availableSeats);
        }).toList();
    }

    @Transactional
    public EventDto createEvent(CreateEventRequest req) {
        Venue venue = venueRepository.findById(req.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + req.getVenueId()));

        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setCategory(req.getCategory());
        event.setVenueId(req.getVenueId());
        event.setStartTime(req.getStartTime() != null ? req.getStartTime() : Instant.now().plusSeconds(86400 * 7));
        event.setEndTime(req.getEndTime() != null ? req.getEndTime() : event.getStartTime().plusSeconds(10800));
        event.setBannerUrl(req.getBannerUrl() != null ? req.getBannerUrl() : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=80");
        event.setStatus(req.getStatus() != null ? req.getStatus() : EventStatus.PUBLISHED);

        event.setBasePriceStandard(req.getBasePriceStandard() != null ? req.getBasePriceStandard() : new BigDecimal("500.00"));
        event.setBasePricePremium(req.getBasePricePremium() != null ? req.getBasePricePremium() : new BigDecimal("1000.00"));
        event.setBasePriceVip(req.getBasePriceVip() != null ? req.getBasePriceVip() : new BigDecimal("2000.00"));

        Event savedEvent = eventRepository.save(event);

        // Generate EventSeat instances for this event based on venue seats
        List<EventSeat> eventSeats = new ArrayList<>();
        if (venue.getSeats() != null && !venue.getSeats().isEmpty()) {
            for (VenueSeat vs : venue.getSeats()) {
                BigDecimal basePrice = switch (vs.getCategory()) {
                    case VIP -> savedEvent.getBasePriceVip();
                    case PREMIUM -> savedEvent.getBasePricePremium();
                    case STANDARD -> savedEvent.getBasePriceStandard();
                };
                eventSeats.add(new EventSeat(
                        savedEvent.getId(),
                        vs.getSeatCode(),
                        vs.getRowLabel(),
                        vs.getSeatNumberInt(),
                        vs.getCategory(),
                        basePrice
                ));
            }
            eventSeatRepository.saveAll(eventSeats);
        }

        return EventDto.fromEntity(savedEvent, venue.getName(), venue.getCity(), eventSeats.size(), eventSeats.size());
    }

    public Event updateEventStatus(String id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        event.setStatus(status);
        return eventRepository.save(event);
    }
}
