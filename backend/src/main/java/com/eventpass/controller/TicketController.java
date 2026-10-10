package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.TicketDto;
import com.eventpass.model.User;
import com.eventpass.model.enums.Role;
import com.eventpass.repository.UserRepository;
import com.eventpass.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Digital ticket viewing, QR code presentation, and download")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get digital ticket by ID with real-time ZXing Base64 QR code")
    public ResponseEntity<ApiResponse<TicketDto>> getTicketById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = null;
        boolean isAdmin = false;
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null) {
                userId = user.getId();
                isAdmin = user.getRole() == Role.ADMIN;
            }
        }
        TicketDto ticket = ticketService.getTicketById(id, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Ticket retrieved successfully", ticket));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get all tickets for a booking with embedded QR codes")
    public ResponseEntity<ApiResponse<List<TicketDto>>> getTicketsByBooking(@PathVariable String bookingId) {
        List<TicketDto> tickets = ticketService.getTicketsByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Tickets retrieved successfully", tickets));
    }
}
