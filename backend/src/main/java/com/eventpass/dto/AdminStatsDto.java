package com.eventpass.dto;

import java.math.BigDecimal;

public class AdminStatsDto {

    private long totalEvents;
    private long totalUsers;
    private long totalBookings;
    private long confirmedBookings;
    private BigDecimal totalRevenue;
    private long ticketsIssued;
    private long ticketsCheckedIn;

    public AdminStatsDto() {
        this.totalRevenue = BigDecimal.ZERO;
    }

    public AdminStatsDto(long totalEvents, long totalUsers, long totalBookings, long confirmedBookings, BigDecimal totalRevenue, long ticketsIssued, long ticketsCheckedIn) {
        this.totalEvents = totalEvents;
        this.totalUsers = totalUsers;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.ticketsIssued = ticketsIssued;
        this.ticketsCheckedIn = ticketsCheckedIn;
    }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    public long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public long getTicketsIssued() { return ticketsIssued; }
    public void setTicketsIssued(long ticketsIssued) { this.ticketsIssued = ticketsIssued; }
    public long getTicketsCheckedIn() { return ticketsCheckedIn; }
    public void setTicketsCheckedIn(long ticketsCheckedIn) { this.ticketsCheckedIn = ticketsCheckedIn; }
}
