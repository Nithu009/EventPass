package com.eventpass.dto;

import com.eventpass.model.Payment;
import com.eventpass.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class PaymentDto {

    private String id;
    private String bookingId;
    private String transactionReference;
    private BigDecimal amount;
    private PaymentStatus status;
    private String paymentMethod;
    private Instant createdAt;
    private List<TicketDto> generatedTickets;

    public PaymentDto() {}

    public static PaymentDto fromEntity(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setBookingId(payment.getBookingId());
        dto.setTransactionReference(payment.getTransactionReference());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<TicketDto> getGeneratedTickets() { return generatedTickets; }
    public void setGeneratedTickets(List<TicketDto> generatedTickets) { this.generatedTickets = generatedTickets; }
}
