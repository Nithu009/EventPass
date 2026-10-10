package com.eventpass.dto;

import com.eventpass.model.Venue;
import com.eventpass.model.VenueSeat;

import java.time.Instant;
import java.util.List;

public class VenueDto {

    private String id;
    private String name;
    private String city;
    private String address;
    private int capacity;
    private int totalRows;
    private int totalColumns;
    private List<VenueSeat> seats;
    private Instant createdAt;

    public VenueDto() {}

    public static VenueDto fromEntity(Venue venue) {
        VenueDto dto = new VenueDto();
        dto.setId(venue.getId());
        dto.setName(venue.getName());
        dto.setCity(venue.getCity());
        dto.setAddress(venue.getAddress());
        dto.setCapacity(venue.getCapacity());
        dto.setTotalRows(venue.getTotalRows());
        dto.setTotalColumns(venue.getTotalColumns());
        dto.setSeats(venue.getSeats());
        dto.setCreatedAt(venue.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public List<VenueSeat> getSeats() { return seats; }
    public void setSeats(List<VenueSeat> seats) { this.seats = seats; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
