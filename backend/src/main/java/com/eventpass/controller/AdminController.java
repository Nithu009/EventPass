package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.*;
import com.eventpass.model.Event;
import com.eventpass.model.PricingRule;
import com.eventpass.model.enums.EventStatus;
import com.eventpass.service.AdminDashboardService;
import com.eventpass.service.EventService;
import com.eventpass.service.PricingEngineService;
import com.eventpass.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Organizer dashboard stats, event creation, gate validation, and dynamic pricing rules")
public class AdminController {

    private final AdminDashboardService adminDashboardService;
    private final EventService eventService;
    private final TicketService ticketService;
    private final PricingEngineService pricingEngineService;

    public AdminController(AdminDashboardService adminDashboardService,
                           EventService eventService,
                           TicketService ticketService,
                           PricingEngineService pricingEngineService) {
        this.adminDashboardService = adminDashboardService;
        this.eventService = eventService;
        this.ticketService = ticketService;
        this.pricingEngineService = pricingEngineService;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get platform performance metrics and revenue aggregation")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin stats retrieved", stats));
    }

    @GetMapping("/events")
    @Operation(summary = "Get all events for management")
    public ResponseEntity<ApiResponse<List<EventDto>>> getAllEvents() {
        List<EventDto> events = eventService.getAllEventsForAdmin();
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved", events));
    }

    @PostMapping("/events")
    @Operation(summary = "Create a new event and generate its seat layout")
    public ResponseEntity<ApiResponse<EventDto>> createEvent(@Valid @RequestBody CreateEventRequest request) {
        EventDto event = eventService.createEvent(request);
        return ResponseEntity.ok(ApiResponse.ok("Event created successfully", event));
    }

    @PutMapping("/events/{id}/status")
    @Operation(summary = "Update event status")
    public ResponseEntity<ApiResponse<Event>> updateEventStatus(
            @PathVariable String id,
            @RequestParam EventStatus status) {
        Event updated = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Event status updated", updated));
    }

    @PostMapping("/tickets/validate")
    @Operation(summary = "Gate entry verification using digital QR validation token")
    public ResponseEntity<ApiResponse<TicketValidationResponse>> validateTicket(
            @Valid @RequestBody TicketValidationRequest request,
            Authentication authentication) {
        String scannedBy = authentication != null ? authentication.getName() : "gate-staff";
        TicketValidationResponse response = ticketService.validateTicket(request.getToken(), scannedBy);
        return ResponseEntity.ok(ApiResponse.ok(response.getStatusMessage(), response));
    }

    @GetMapping("/pricing-rules")
    @Operation(summary = "List all dynamic pricing rules")
    public ResponseEntity<ApiResponse<List<PricingRule>>> getPricingRules() {
        return ResponseEntity.ok(ApiResponse.ok("Pricing rules retrieved", pricingEngineService.getAllRules()));
    }

    @PostMapping("/pricing-rules")
    @Operation(summary = "Create a new dynamic pricing rule")
    public ResponseEntity<ApiResponse<PricingRule>> createPricingRule(@Valid @RequestBody PricingRuleDto dto) {
        PricingRule created = pricingEngineService.createRule(dto);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule created", created));
    }

    @DeleteMapping("/pricing-rules/{id}")
    @Operation(summary = "Delete dynamic pricing rule")
    public ResponseEntity<ApiResponse<Void>> deletePricingRule(@PathVariable String id) {
        pricingEngineService.deleteRule(id);
        return ResponseEntity.ok(ApiResponse.ok("Pricing rule deleted", null));
    }
}
