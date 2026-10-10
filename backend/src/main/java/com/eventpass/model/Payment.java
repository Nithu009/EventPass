package com.eventpass.model;

import com.eventpass.model.enums.PaymentStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    @Indexed
    private String bookingId;

    @Indexed(unique = true)
    private String transactionReference;

    private String provider = "MOCK_SANDBOX";
    private BigDecimal amount;

    @Indexed
    private PaymentStatus status = PaymentStatus.CREATED;

    private String paymentMethod;
    private Instant verifiedAt;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Payment() {}

    public Payment(String bookingId, String transactionReference, BigDecimal amount, String paymentMethod) {
        this.bookingId = bookingId;
        this.transactionReference = transactionReference;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.provider = "MOCK_SANDBOX";
        this.status = PaymentStatus.CREATED;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
