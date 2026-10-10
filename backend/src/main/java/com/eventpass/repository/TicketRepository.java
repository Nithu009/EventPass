package com.eventpass.repository;

import com.eventpass.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    Optional<Ticket> findByQrValidationToken(String qrValidationToken);

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByBookingId(String bookingId);

    List<Ticket> findByEventId(String eventId);

    long countByEventId(String eventId);

    long countByEventIdAndUsedTrue(String eventId);

    long countByUsedTrue();
}
