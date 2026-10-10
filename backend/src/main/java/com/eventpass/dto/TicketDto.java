package com.eventpass.dto;

import com.eventpass.model.Ticket;
import com.eventpass.model.enums.SeatCategory;

import java.math.BigDecimal;
import java.time.Instant;

public class TicketDto {

    private String id;
    private String bookingId;
    private String eventId;
    private String eventTitle;
    private String venueName;
    private String venueCity;
    private Instant eventStartTime;
    private String seatCode;
    private SeatCategory seatCategory;
    private BigDecimal pricePaid;
    private String ticketNumber;
    private String qrValidationToken;
    private String qrCodeBase64;
    private boolean used;
    private Instant usedAt;
    private String attendeeName;
    private String attendeeEmail;
    private Instant createdAt;

    public TicketDto() {}

    public static TicketDto fromEntity(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setBookingId(ticket.getBookingId());
        dto.setEventId(ticket.getEventId());
        dto.setSeatCode(ticket.getSeatCode());
        dto.setSeatCategory(ticket.getSeatCategory());
        dto.setPricePaid(ticket.getPricePaid());
        dto.setTicketNumber(ticket.getTicketNumber());
        dto.setQrValidationToken(ticket.getQrValidationToken());
        dto.setUsed(ticket.isUsed());
        dto.setUsedAt(ticket.getUsedAt());
        dto.setAttendeeName(ticket.getAttendeeName());
        dto.setAttendeeEmail(ticket.getAttendeeEmail());
        dto.setCreatedAt(ticket.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public String getVenueCity() { return venueCity; }
    public void setVenueCity(String venueCity) { this.venueCity = venueCity; }
    public Instant getEventStartTime() { return eventStartTime; }
    public void setEventStartTime(Instant eventStartTime) { this.eventStartTime = eventStartTime; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public SeatCategory getSeatCategory() { return seatCategory; }
    public void setSeatCategory(SeatCategory seatCategory) { this.seatCategory = seatCategory; }
    public BigDecimal getPricePaid() { return pricePaid; }
    public void setPricePaid(BigDecimal pricePaid) { this.pricePaid = pricePaid; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getQrValidationToken() { return qrValidationToken; }
    public void setQrValidationToken(String qrValidationToken) { this.qrValidationToken = qrValidationToken; }
    public String getQrCodeBase64() { return qrCodeBase64; }
    public void setQrCodeBase64(String qrCodeBase64) { this.qrCodeBase64 = qrCodeBase64; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public Instant getUsedAt() { return usedAt; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }
    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
