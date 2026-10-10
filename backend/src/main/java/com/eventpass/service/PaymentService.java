package com.eventpass.service;

import com.eventpass.common.BusinessException;
import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.PaymentDto;
import com.eventpass.dto.PaymentRequest;
import com.eventpass.dto.TicketDto;
import com.eventpass.model.*;
import com.eventpass.model.enums.BookingStatus;
import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.model.enums.PaymentStatus;
import com.eventpass.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EventSeatRepository eventSeatRepository;
    private final SeatLockRepository seatLockRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketService ticketService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          EventSeatRepository eventSeatRepository,
                          SeatLockRepository seatLockRepository,
                          TicketRepository ticketRepository,
                          UserRepository userRepository,
                          TicketService ticketService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.eventSeatRepository = eventSeatRepository;
        this.seatLockRepository = seatLockRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.ticketService = ticketService;
    }

    @Transactional
    public PaymentDto processPayment(PaymentRequest request, String userId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + request.getBookingId()));

        if (!booking.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized to process payment for this booking");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new BusinessException("Booking has already been paid and confirmed");
        }

        String transactionRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis() % 10000;
        Payment payment = new Payment(
                booking.getId(),
                transactionRef,
                booking.getTotalAmount(),
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD"
        );

        if (!request.isSimulateSuccess()) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            booking.setStatus(BookingStatus.FAILED);
            bookingRepository.save(booking);

            PaymentDto dto = PaymentDto.fromEntity(payment);
            return dto;
        }

        // Payment successful
        payment.setStatus(PaymentStatus.SUCCESS);
        Payment savedPayment = paymentRepository.save(payment);

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        User user = userRepository.findById(userId).orElse(null);
        String attendeeName = user != null ? user.getFullName() : "Attendee";
        String attendeeEmail = user != null ? user.getEmail() : "";

        List<Ticket> generatedTickets = new ArrayList<>();

        for (BookingItem item : booking.getItems()) {
            // Confirm seat permanently booked
            eventSeatRepository.findByEventIdAndSeatCode(booking.getEventId(), item.getSeatCode()).ifPresent(seat -> {
                seat.setStatus(EventSeatStatus.BOOKED);
                eventSeatRepository.save(seat);
            });

            // Generate Ticket
            String ticketNumber = "TK-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String qrToken = "EP-TOKEN-" + UUID.randomUUID().toString();

            Ticket ticket = new Ticket(
                    booking.getId(),
                    booking.getEventId(),
                    userId,
                    item.getSeatCode(),
                    item.getCategory(),
                    item.getPriceSnapshot(),
                    ticketNumber,
                    qrToken,
                    attendeeName,
                    attendeeEmail
            );
            generatedTickets.add(ticketRepository.save(ticket));
        }

        // Clean up any remaining locks held by user for this event
        seatLockRepository.deleteByUserIdAndEventId(userId, booking.getEventId());

        PaymentDto dto = PaymentDto.fromEntity(savedPayment);
        List<TicketDto> ticketDtos = generatedTickets.stream().map(t -> {
            TicketDto td = TicketDto.fromEntity(t);
            td.setQrCodeBase64(ticketService.generateQrBase64(t.getQrValidationToken()));
            return td;
        }).toList();
        dto.setGeneratedTickets(ticketDtos);

        return dto;
    }

    public PaymentDto getPaymentByBookingId(String bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for booking: " + bookingId));
        return PaymentDto.fromEntity(payment);
    }
}
