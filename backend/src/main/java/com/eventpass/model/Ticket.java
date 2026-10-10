package com.eventpass.model;

import com.eventpass.model.enums.SeatCategory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @Indexed
    private String bookingId;

    @Indexed
    private String eventId;

    @Indexed
    private String userId;

    private String bookingItemEventSeatId;

    @Indexed(unique = true)
    private String ticketNumber;

    @Indexed(unique = true)
    private String qrValidationToken;

    private String eventTitle;
    private String seatCode;
    private SeatCategory seatCategory;
    private BigDecimal pricePaid;

    private String attendeeName;
    private String attendeeEmail;

    private boolean scanned = false;
    private Instant scannedAt;
    private String scannedBy; // email of the admin/gate-staff who scanned

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Ticket() {}

    public Ticket(String bookingId, String eventId, String userId, String seatCode, SeatCategory seatCategory, BigDecimal pricePaid, String ticketNumber, String qrValidationToken, String attendeeName, String attendeeEmail) {
        this.bookingId = bookingId;
        this.eventId = eventId;
        this.userId = userId;
        this.seatCode = seatCode;
        this.seatCategory = seatCategory;
        this.pricePaid = pricePaid;
        this.ticketNumber = ticketNumber;
        this.qrValidationToken = qrValidationToken;
        this.attendeeName = attendeeName;
        this.attendeeEmail = attendeeEmail;
        this.scanned = false;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getBookingItemEventSeatId() { return bookingItemEventSeatId; }
    public void setBookingItemEventSeatId(String bookingItemEventSeatId) { this.bookingItemEventSeatId = bookingItemEventSeatId; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getQrValidationToken() { return qrValidationToken; }
    public void setQrValidationToken(String qrValidationToken) { this.qrValidationToken = qrValidationToken; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public SeatCategory getSeatCategory() { return seatCategory; }
    public void setSeatCategory(SeatCategory seatCategory) { this.seatCategory = seatCategory; }
    public BigDecimal getPricePaid() { return pricePaid; }
    public void setPricePaid(BigDecimal pricePaid) { this.pricePaid = pricePaid; }
    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }
    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }

    // Primary scanned fields
    public boolean isScanned() { return scanned; }
    public void setScanned(boolean scanned) { this.scanned = scanned; }
    public Instant getScannedAt() { return scannedAt; }
    public void setScannedAt(Instant scannedAt) { this.scannedAt = scannedAt; }
    public String getScannedBy() { return scannedBy; }
    public void setScannedBy(String scannedBy) { this.scannedBy = scannedBy; }

    // Backward compat aliases (used = scanned)
    public boolean isUsed() { return scanned; }
    public void setUsed(boolean used) { this.scanned = used; }
    public Instant getUsedAt() { return scannedAt; }
    public void setUsedAt(Instant usedAt) { this.scannedAt = usedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
