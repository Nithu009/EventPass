package com.eventpass.dto;

import java.util.List;
import java.util.Map;

public class SeatLayoutDto {

    private String eventId;
    private String eventTitle;
    private String venueName;
    private int totalRows;
    private int totalColumns;
    private int totalSeats;
    private int availableCount;
    private int lockedCount;
    private int bookedCount;
    private List<SeatDto> seats;
    private Map<String, Object> pricingBreakdown;

    public SeatLayoutDto() {}

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }
    public int getTotalColumns() { return totalColumns; }
    public void setTotalColumns(int totalColumns) { this.totalColumns = totalColumns; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getAvailableCount() { return availableCount; }
    public void setAvailableCount(int availableCount) { this.availableCount = availableCount; }
    public int getLockedCount() { return lockedCount; }
    public void setLockedCount(int lockedCount) { this.lockedCount = lockedCount; }
    public int getBookedCount() { return bookedCount; }
    public void setBookedCount(int bookedCount) { this.bookedCount = bookedCount; }
    public List<SeatDto> getSeats() { return seats; }
    public void setSeats(List<SeatDto> seats) { this.seats = seats; }
    public Map<String, Object> getPricingBreakdown() { return pricingBreakdown; }
    public void setPricingBreakdown(Map<String, Object> pricingBreakdown) { this.pricingBreakdown = pricingBreakdown; }
}
