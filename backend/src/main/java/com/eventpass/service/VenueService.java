package com.eventpass.service;

import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.CreateVenueRequest;
import com.eventpass.dto.VenueDto;
import com.eventpass.model.Venue;
import com.eventpass.model.VenueSeat;
import com.eventpass.model.enums.SeatCategory;
import com.eventpass.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public List<VenueDto> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(VenueDto::fromEntity)
                .toList();
    }

    public VenueDto getVenueById(String id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
        return VenueDto.fromEntity(venue);
    }

    public Venue getVenueEntityById(String id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
    }

    public VenueDto createVenue(CreateVenueRequest request) {
        Venue venue = new Venue(
                request.getName(),
                request.getCity(),
                request.getAddress(),
                request.getCapacity(),
                request.getTotalRows(),
                request.getTotalColumns()
        );

        List<VenueSeat> seats = new ArrayList<>();
        if (request.getSeatTemplates() != null && !request.getSeatTemplates().isEmpty()) {
            for (CreateVenueRequest.SeatTemplate tmpl : request.getSeatTemplates()) {
                String seatCode = tmpl.getRowLabel() + tmpl.getSeatNumber();
                seats.add(new VenueSeat(seatCode, tmpl.getRowLabel(), tmpl.getSeatNumber(), tmpl.getCategory()));
            }
        } else if (request.getTotalRows() > 0 && request.getTotalColumns() > 0) {
            // Auto-generate standard grid: Rows A, B, C...
            for (int r = 0; r < request.getTotalRows(); r++) {
                char rowChar = (char) ('A' + r);
                String rowLabel = String.valueOf(rowChar);
                SeatCategory category;
                if (r < 2) {
                    category = SeatCategory.VIP; // First 2 rows VIP
                } else if (r < 5) {
                    category = SeatCategory.PREMIUM; // Next 3 rows Premium
                } else {
                    category = SeatCategory.STANDARD; // Remaining rows Standard
                }

                for (int c = 1; c <= request.getTotalColumns(); c++) {
                    String seatCode = rowLabel + c;
                    seats.add(new VenueSeat(seatCode, rowLabel, c, category));
                }
            }
            venue.setCapacity(seats.size());
        }

        venue.setSeats(seats);
        Venue saved = venueRepository.save(venue);
        return VenueDto.fromEntity(saved);
    }
}
