package com.eventpass.model;

import com.eventpass.model.enums.SeatCategory;

import java.math.BigDecimal;

public class BookingItem {

    private String eventSeatId;
    private String seatCode;
    private String rowLabel;
    private int seatNumber;
    private SeatCategory seatCategory;
    private BigDecimal basePrice;
    private BigDecimal finalPrice;

    public BookingItem() {}

    public BookingItem(String eventSeatId, String seatCode, String rowLabel, int seatNumber, SeatCategory seatCategory, BigDecimal finalPrice) {
        this.eventSeatId = eventSeatId;
        this.seatCode = seatCode;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.seatCategory = seatCategory;
        this.basePrice = finalPrice;
        this.finalPrice = finalPrice;
    }

    public String getEventSeatId() { return eventSeatId; }
    public void setEventSeatId(String eventSeatId) { this.eventSeatId = eventSeatId; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
    public SeatCategory getSeatCategory() { return seatCategory; }
    public void setSeatCategory(SeatCategory seatCategory) { this.seatCategory = seatCategory; }
    public SeatCategory getCategory() { return seatCategory; }
    public void setCategory(SeatCategory category) { this.seatCategory = category; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
    public BigDecimal getPriceSnapshot() { return finalPrice; }
    public void setPriceSnapshot(BigDecimal priceSnapshot) { this.finalPrice = priceSnapshot; }
}
