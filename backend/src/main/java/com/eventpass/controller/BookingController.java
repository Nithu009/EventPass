package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.BookingDto;
import com.eventpass.dto.CreateBookingRequest;
import com.eventpass.model.User;
import com.eventpass.model.enums.Role;
import com.eventpass.repository.UserRepository;
import com.eventpass.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Bookings", description = "Reservation lifecycle, order creation, and user booking history")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @PostMapping("/bookings")
    @Operation(summary = "Convert active seat lock reservation into a pending payment booking")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        User user = getUser(authentication);
        BookingDto booking = bookingService.createBooking(request, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking created successfully", booking));
    }

    @GetMapping("/bookings/my")
    @Operation(summary = "Retrieve authenticated attendee's booking history")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(Authentication authentication) {
        User user = getUser(authentication);
        List<BookingDto> bookings = bookingService.getUserBookings(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{id}")
    @Operation(summary = "Retrieve specific booking details by ID")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(
            @PathVariable String id,
            Authentication authentication) {
        User user = getUser(authentication);
        boolean isAdmin = user.getRole() == Role.ADMIN;
        BookingDto booking = bookingService.getBookingById(id, user.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Booking retrieved successfully", booking));
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin audit list of all platform bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookingsAdmin() {
        List<BookingDto> bookings = bookingService.getAllBookingsForAdmin();
        return ResponseEntity.ok(ApiResponse.ok("All bookings retrieved successfully", bookings));
    }

    private User getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new com.eventpass.common.BusinessException("Authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new com.eventpass.common.ResourceNotFoundException("User not found"));
    }
}
