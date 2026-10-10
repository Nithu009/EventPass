package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.SeatLayoutDto;
import com.eventpass.dto.SeatLockRequest;
import com.eventpass.dto.SeatLockResponse;
import com.eventpass.model.User;
import com.eventpass.repository.UserRepository;
import com.eventpass.service.SeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Seats & Real-time Locking", description = "Interactive seat map, 8-minute TTL locking engine, and seat release")
public class SeatController {

    private final SeatService seatService;
    private final UserRepository userRepository;

    public SeatController(SeatService seatService, UserRepository userRepository) {
        this.seatService = seatService;
        this.userRepository = userRepository;
    }

    @GetMapping("/events/{eventId}/seats")
    @Operation(summary = "Get interactive seating map with availability and dynamic tier prices")
    public ResponseEntity<ApiResponse<SeatLayoutDto>> getSeatLayout(
            @PathVariable String eventId,
            Authentication authentication) {
        String currentUserId = null;
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            currentUserId = userRepository.findByEmail(authentication.getName())
                    .map(User::getId)
                    .orElse(null);
        }
        SeatLayoutDto layout = seatService.getSeatLayout(eventId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Seat layout retrieved successfully", layout));
    }

    @PostMapping("/events/{eventId}/seats/lock")
    @Operation(summary = "Acquire temporary 8-minute lock on up to 6 seats")
    public ResponseEntity<ApiResponse<SeatLockResponse>> lockSeats(
            @PathVariable String eventId,
            @Valid @RequestBody SeatLockRequest request,
            Authentication authentication) {
        String userId = getUserId(authentication);
        SeatLockResponse response = seatService.lockSeats(eventId, request, userId);
        return ResponseEntity.ok(ApiResponse.ok("Seats locked successfully for 8 minutes", response));
    }

    @PostMapping("/seats/release")
    @Operation(summary = "Voluntarily release locked seats")
    public ResponseEntity<ApiResponse<Void>> releaseSeats(
            @RequestParam String lockToken,
            Authentication authentication) {
        String userId = getUserId(authentication);
        seatService.releaseSeats(lockToken, userId);
        return ResponseEntity.ok(ApiResponse.ok("Seats released successfully", null));
    }

    private String getUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new com.eventpass.common.BusinessException("Authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .map(User::getId)
                .orElseThrow(() -> new com.eventpass.common.ResourceNotFoundException("User not found"));
    }
}
