package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.EventDto;
import com.eventpass.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Events", description = "Public event discovery, search, and details")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Browse published events with category and keyword search")
    public ResponseEntity<ApiResponse<List<EventDto>>> getEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        List<EventDto> events = eventService.getPublishedEvents(keyword, category);
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved successfully", events));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed event information and pricing snapshot")
    public ResponseEntity<ApiResponse<EventDto>> getEventById(@PathVariable String id) {
        EventDto event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.ok("Event retrieved successfully", event));
    }
}
