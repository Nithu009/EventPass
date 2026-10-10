package com.eventpass.dto;

import com.eventpass.model.EventSeat;
import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.model.enums.SeatCategory;

import java.math.BigDecimal;

public class SeatDto {

    private String id;
    private String eventId;
    private String seatCode;
    private String rowLabel;
    private int seatNumber;
    private SeatCategory category;
    private EventSeatStatus status;
    private BigDecimal currentPrice;
    private boolean lockedByCurrentUser;

    public SeatDto() {}

    public static SeatDto fromEntity(EventSeat seat, BigDecimal calculatedPrice, boolean lockedByCurrentUser) {
        SeatDto dto = new SeatDto();
        dto.setId(seat.getId());
        dto.setEventId(seat.getEventId());
        dto.setSeatCode(seat.getSeatCode());
        dto.setRowLabel(seat.getRowLabel());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setCategory(seat.getCategory());
        dto.setStatus(seat.getStatus());
        dto.setCurrentPrice(calculatedPrice != null ? calculatedPrice : seat.getBasePrice());
        dto.setLockedByCurrentUser(lockedByCurrentUser);
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
    public SeatCategory getCategory() { return category; }
    public void setCategory(SeatCategory category) { this.category = category; }
    public EventSeatStatus getStatus() { return status; }
    public void setStatus(EventSeatStatus status) { this.status = status; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
    public boolean isLockedByCurrentUser() { return lockedByCurrentUser; }
    public void setLockedByCurrentUser(boolean lockedByCurrentUser) { this.lockedByCurrentUser = lockedByCurrentUser; }
}
