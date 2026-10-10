package com.eventpass.service;

import com.eventpass.dto.AdminStatsDto;
import com.eventpass.model.Payment;
import com.eventpass.model.enums.BookingStatus;
import com.eventpass.model.enums.PaymentStatus;
import com.eventpass.repository.BookingRepository;
import com.eventpass.repository.EventRepository;
import com.eventpass.repository.PaymentRepository;
import com.eventpass.repository.TicketRepository;
import com.eventpass.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminDashboardService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public AdminDashboardService(EventRepository eventRepository,
                                 UserRepository userRepository,
                                 BookingRepository bookingRepository,
                                 PaymentRepository paymentRepository,
                                 TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
    }

    public AdminStatsDto getDashboardStats() {
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);

        List<Payment> successfulPayments = paymentRepository.findByStatus(PaymentStatus.SUCCESS);
        BigDecimal totalRevenue = successfulPayments.stream()
                .map(Payment::getAmount)
                .filter(amt -> amt != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long ticketsIssued = ticketRepository.count();
        long ticketsCheckedIn = ticketRepository.countByScannedTrue();

        return new AdminStatsDto(
                totalEvents,
                totalUsers,
                totalBookings,
                confirmedBookings,
                totalRevenue,
                ticketsIssued,
                ticketsCheckedIn
        );
    }
}
