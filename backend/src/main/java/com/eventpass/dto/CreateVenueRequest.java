package com.eventpass.dto;

import com.eventpass.model.enums.SeatCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class CreateVenueRequest {

    @NotBlank(message = "Venue name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Address is required")
    private String address;

    @Positive(message = "Capacity must be positive")
    private int capacity;

    private int totalRows;
    private int totalColumns;

    private List<SeatTemplate> seatTemplates;

    public static class SeatTemplate {
        private String rowLabel;
        private int seatNumber;
        private SeatCategory category;

        public SeatTemplate() {}

        public SeatTemplate(String rowLabel, int seatNumber, SeatCategory category) {
            this.rowLabel = rowLabel;
            this.seatNumber = seatNumber;
            this.category = category;
        }

        public String getRowLabel() { return rowLabel; }
        public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }
        public int getSeatNumber() { return seatNumber; }
        public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }
        public SeatCategory getCategory() { return category; }
        public void setCategory(SeatCategory category) { this.category = category; }
    }

    public CreateVenueRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }
    public int getTotalColumns() { return totalColumns; }
    public void setTotalColumns(int totalColumns) { this.totalColumns = totalColumns; }
    public List<SeatTemplate> getSeatTemplates() { return seatTemplates; }
    public void setSeatTemplates(List<SeatTemplate> seatTemplates) { this.seatTemplates = seatTemplates; }
}
