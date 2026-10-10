package com.eventpass.dto;

import com.eventpass.model.Booking;
import com.eventpass.model.BookingItem;
import com.eventpass.model.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class BookingDto {

    private String id;
    private String bookingReference;
    private String userId;
    private String userEmail;
    private String userName;
    private String eventId;
    private String eventTitle;
    private String venueName;
    private Instant eventStartTime;
    private BookingStatus status;
    private BigDecimal subtotal;
    private BigDecimal serviceFee;
    private BigDecimal totalAmount;
    private List<BookingItem> items;
    private Instant expiresAt;
    private Instant createdAt;

    public BookingDto() {}

    public static BookingDto fromEntity(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setUserId(booking.getUserId());
        dto.setEventId(booking.getEventId());
        dto.setStatus(booking.getStatus());
        dto.setSubtotal(booking.getSubtotal());
        dto.setServiceFee(booking.getServiceFee());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setItems(booking.getItems());
        dto.setExpiresAt(booking.getExpiresAt());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public Instant getEventStartTime() { return eventStartTime; }
    public void setEventStartTime(Instant eventStartTime) { this.eventStartTime = eventStartTime; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public List<BookingItem> getItems() { return items; }
    public void setItems(List<BookingItem> items) { this.items = items; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
