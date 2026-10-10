package com.eventpass.repository;

import com.eventpass.model.Payment;
import com.eventpass.model.enums.PaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByBookingId(String bookingId);

    Optional<Payment> findByTransactionReference(String transactionReference);

    long countByStatus(PaymentStatus status);

    List<Payment> findByStatus(PaymentStatus status);
}
