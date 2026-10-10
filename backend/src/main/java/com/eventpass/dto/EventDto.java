package com.eventpass.dto;

import com.eventpass.model.Event;
import com.eventpass.model.enums.EventStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class EventDto {

    private String id;
    private String title;
    private String description;
    private String category;
    private String venueId;
    private String venueName;
    private String venueCity;
    private Instant startTime;
    private Instant endTime;
    private String bannerUrl;
    private EventStatus status;
    private BigDecimal basePriceStandard;
    private BigDecimal basePricePremium;
    private BigDecimal basePriceVip;
    private BigDecimal currentStandardPrice;
    private BigDecimal currentPremiumPrice;
    private BigDecimal currentVipPrice;
    private int totalSeats;
    private int availableSeats;
    private Instant createdAt;

    public EventDto() {}

    public static EventDto fromEntity(Event event, String venueName, String venueCity, int totalSeats, int availableSeats) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setVenueId(event.getVenueId());
        dto.setVenueName(venueName);
        dto.setVenueCity(venueCity);
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setBannerUrl(event.getBannerUrl());
        dto.setStatus(event.getStatus());
        dto.setBasePriceStandard(event.getBasePriceStandard());
        dto.setBasePricePremium(event.getBasePricePremium());
        dto.setBasePriceVip(event.getBasePriceVip());
        dto.setCurrentStandardPrice(event.getBasePriceStandard());
        dto.setCurrentPremiumPrice(event.getBasePricePremium());
        dto.setCurrentVipPrice(event.getBasePriceVip());
        dto.setTotalSeats(totalSeats);
        dto.setAvailableSeats(availableSeats);
        dto.setCreatedAt(event.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getVenueId() { return venueId; }
    public void setVenueId(String venueId) { this.venueId = venueId; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public String getVenueCity() { return venueCity; }
    public void setVenueCity(String venueCity) { this.venueCity = venueCity; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    public BigDecimal getBasePriceStandard() { return basePriceStandard; }
    public void setBasePriceStandard(BigDecimal basePriceStandard) { this.basePriceStandard = basePriceStandard; }
    public BigDecimal getBasePricePremium() { return basePricePremium; }
    public void setBasePricePremium(BigDecimal basePricePremium) { this.basePricePremium = basePricePremium; }
    public BigDecimal getBasePriceVip() { return basePriceVip; }
    public void setBasePriceVip(BigDecimal basePriceVip) { this.basePriceVip = basePriceVip; }
    public BigDecimal getCurrentStandardPrice() { return currentStandardPrice; }
    public void setCurrentStandardPrice(BigDecimal currentStandardPrice) { this.currentStandardPrice = currentStandardPrice; }
    public BigDecimal getCurrentPremiumPrice() { return currentPremiumPrice; }
    public void setCurrentPremiumPrice(BigDecimal currentPremiumPrice) { this.currentPremiumPrice = currentPremiumPrice; }
    public BigDecimal getCurrentVipPrice() { return currentVipPrice; }
    public void setCurrentVipPrice(BigDecimal currentVipPrice) { this.currentVipPrice = currentVipPrice; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
