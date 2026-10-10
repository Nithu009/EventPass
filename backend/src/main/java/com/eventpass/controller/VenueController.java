package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.CreateVenueRequest;
import com.eventpass.dto.VenueDto;
import com.eventpass.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Venues", description = "Venue topology and seating map configuration")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping("/venues")
    @Operation(summary = "List all registered venues")
    public ResponseEntity<ApiResponse<List<VenueDto>>> getAllVenues() {
        return ResponseEntity.ok(ApiResponse.ok("Venues retrieved", venueService.getAllVenues()));
    }

    @GetMapping("/venues/{id}")
    @Operation(summary = "Get venue layout and seat topology by ID")
    public ResponseEntity<ApiResponse<VenueDto>> getVenueById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("Venue retrieved", venueService.getVenueById(id)));
    }

    @PostMapping("/admin/venues")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new venue with layout topology")
    public ResponseEntity<ApiResponse<VenueDto>> createVenue(@Valid @RequestBody CreateVenueRequest request) {
        VenueDto created = venueService.createVenue(request);
        return ResponseEntity.ok(ApiResponse.ok("Venue created successfully", created));
    }
}
