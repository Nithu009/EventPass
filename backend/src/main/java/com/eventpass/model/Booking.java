package com.eventpass.model;

import com.eventpass.model.enums.BookingStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bookings")
@CompoundIndexes({
    @CompoundIndex(name = "user_event", def = "{'userId': 1, 'eventId': 1}")
})
public class Booking {

    @Id
    private String id;

    @Indexed(unique = true)
    private String bookingReference;

    @Indexed
    private String userId;

    @Indexed
    private String eventId;

    private String eventTitle;

    private List<BookingItem> items = new ArrayList<>();

    private BigDecimal subtotal;
    private BigDecimal serviceFee;
    private BigDecimal totalAmount;

    @Indexed
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    private Instant expiresAt;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt;

    public Booking() {}

    public Booking(String bookingReference, String userId, String eventId, List<BookingItem> items, BigDecimal subtotal, BigDecimal serviceFee, BigDecimal totalAmount, Instant expiresAt) {
        this.bookingReference = bookingReference;
        this.userId = userId;
        this.eventId = eventId;
        this.items = items;
        this.subtotal = subtotal;
        this.serviceFee = serviceFee;
        this.totalAmount = totalAmount;
        this.expiresAt = expiresAt;
        this.status = BookingStatus.PENDING_PAYMENT;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public List<BookingItem> getItems() { return items; }
    public void setItems(List<BookingItem> items) { this.items = items; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
