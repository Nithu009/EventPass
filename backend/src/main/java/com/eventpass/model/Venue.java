package com.eventpass.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "venues")
public class Venue {

    @Id
    private String id;

    private String name;
    private String address;
    private String city;
    private int totalCapacity;
    private int totalRows;
    private int totalColumns;

    private List<VenueSeat> seats = new ArrayList<>();

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Venue() {}

    public Venue(String name, String city, String address, int capacity, int totalRows, int totalColumns) {
        this.name = name;
        this.city = city;
        this.address = address;
        this.totalCapacity = capacity;
        this.totalRows = totalRows;
        this.totalColumns = totalColumns;
        this.seats = new ArrayList<>();
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public int getCapacity() { return totalCapacity; }
    public void setCapacity(int capacity) { this.totalCapacity = capacity; }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }
    public int getTotalColumns() { return totalColumns; }
    public void setTotalColumns(int totalColumns) { this.totalColumns = totalColumns; }

    public List<VenueSeat> getSeats() { return seats; }
    public void setSeats(List<VenueSeat> seats) { this.seats = seats; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
