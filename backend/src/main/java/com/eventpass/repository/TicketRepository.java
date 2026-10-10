package com.eventpass.repository;

import com.eventpass.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    Optional<Ticket> findByQrValidationToken(String qrValidationToken);

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByBookingId(String bookingId);

    List<Ticket> findByEventId(String eventId);

    long countByEventId(String eventId);

    long countByScannedTrue();

    long countByEventIdAndScannedTrue(String eventId);

    @Query(value = "{ 'scanned': true }", count = true)
    long countByUsedTrue();

    @Query(value = "{ 'eventId': ?0, 'scanned': true }", count = true)
    long countByEventIdAndUsedTrue(String eventId);
}
