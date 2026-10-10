package com.eventpass.dto;

import com.eventpass.model.enums.EventStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Venue ID is required")
    private String venueId;

    private Instant startTime;
    private Instant endTime;
    private String bannerUrl;

    private BigDecimal basePriceStandard;
    private BigDecimal basePricePremium;
    private BigDecimal basePriceVip;

    private EventStatus status = EventStatus.PUBLISHED;

    public CreateEventRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getVenueId() { return venueId; }
    public void setVenueId(String venueId) { this.venueId = venueId; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }
    public BigDecimal getBasePriceStandard() { return basePriceStandard; }
    public void setBasePriceStandard(BigDecimal basePriceStandard) { this.basePriceStandard = basePriceStandard; }
    public BigDecimal getBasePricePremium() { return basePricePremium; }
    public void setBasePricePremium(BigDecimal basePricePremium) { this.basePricePremium = basePricePremium; }
    public BigDecimal getBasePriceVip() { return basePriceVip; }
    public void setBasePriceVip(BigDecimal basePriceVip) { this.basePriceVip = basePriceVip; }
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    // Aliases to seamlessly support frontend naming conventions
    public void setEventDate(String dateStr) {
        if (dateStr != null && !dateStr.isBlank()) {
            try {
                if (dateStr.length() == 10) {
                    this.startTime = java.time.LocalDate.parse(dateStr).atStartOfDay(java.time.ZoneOffset.UTC).toInstant();
                } else {
                    this.startTime = Instant.parse(dateStr);
                }
            } catch (Exception e) {
                this.startTime = Instant.now().plusSeconds(86400 * 7);
            }
        }
    }

    public void setBaseStandardPrice(BigDecimal price) { this.basePriceStandard = price; }
    public void setBasePremiumPrice(BigDecimal price) { this.basePricePremium = price; }
    public void setBaseVipPrice(BigDecimal price) { this.basePriceVip = price; }
}

