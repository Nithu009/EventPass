package com.eventpass.model;

import com.eventpass.model.enums.SeatCategory;

public class VenueSeat {

    private String seatCode;
    private String seatRow;
    private String seatNumber;
    private SeatCategory category;

    public VenueSeat() {}

    public VenueSeat(String seatRow, String seatNumber, SeatCategory category) {
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.seatCode = seatRow + "-" + seatNumber;
        this.category = category;
    }

    public VenueSeat(String seatCode, String seatRow, int seatNumber, SeatCategory category) {
        this.seatCode = seatCode;
        this.seatRow = seatRow;
        this.seatNumber = String.valueOf(seatNumber);
        this.category = category;
    }

    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public String getRowLabel() { return seatRow; }
    public void setRowLabel(String rowLabel) { this.seatRow = rowLabel; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public int getSeatNumberInt() {
        try {
            return Integer.parseInt(seatNumber);
        } catch (Exception e) {
            return 1;
        }
    }

    public SeatCategory getCategory() { return category; }
    public void setCategory(SeatCategory category) { this.category = category; }
}
