package com.eventpass.controller;

import com.eventpass.common.ApiResponse;
import com.eventpass.dto.PaymentDto;
import com.eventpass.dto.PaymentRequest;
import com.eventpass.model.User;
import com.eventpass.repository.UserRepository;
import com.eventpass.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Simulated payment gateway, atomic reconciliation, and ticket issuance")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/process")
    @Operation(summary = "Process transaction, reconcile booking, and issue digital QR tickets")
    public ResponseEntity<ApiResponse<PaymentDto>> processPayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {
        User user = getUser(authentication);
        PaymentDto payment = paymentService.processPayment(request, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", payment));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Retrieve payment status record by booking ID")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentByBooking(@PathVariable String bookingId) {
        PaymentDto payment = paymentService.getPaymentByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Payment record retrieved successfully", payment));
    }

    private User getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new com.eventpass.common.BusinessException("Authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new com.eventpass.common.ResourceNotFoundException("User not found"));
    }
}
