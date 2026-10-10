package com.eventpass.model;

import com.eventpass.model.enums.EventStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String venueId;
    private String venueName;

    @TextIndexed(weight = 3)
    private String title;

    @TextIndexed(weight = 1)
    private String description;

    @Indexed
    private String category;

    private String bannerImageUrl;

    @Indexed
    private Instant eventDate;
    private Instant endTime;

    @Indexed
    private EventStatus status = EventStatus.DRAFT;

    private BigDecimal baseStandardPrice;
    private BigDecimal basePremiumPrice;
    private BigDecimal baseVipPrice;

    private int totalSeats = 0;
    private int bookedSeats = 0;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt;

    public Event() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVenueId() { return venueId; }
    public void setVenueId(String venueId) { this.venueId = venueId; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public String getBannerUrl() { return bannerImageUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerImageUrl = bannerUrl; }

    public Instant getEventDate() { return eventDate; }
    public void setEventDate(Instant eventDate) { this.eventDate = eventDate; }

    public Instant getStartTime() { return eventDate; }
    public void setStartTime(Instant startTime) { this.eventDate = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public BigDecimal getBaseStandardPrice() { return baseStandardPrice; }
    public void setBaseStandardPrice(BigDecimal baseStandardPrice) { this.baseStandardPrice = baseStandardPrice; }

    public BigDecimal getBasePremiumPrice() { return basePremiumPrice; }
    public void setBasePremiumPrice(BigDecimal basePremiumPrice) { this.basePremiumPrice = basePremiumPrice; }

    public BigDecimal getBaseVipPrice() { return baseVipPrice; }
    public void setBaseVipPrice(BigDecimal baseVipPrice) { this.baseVipPrice = baseVipPrice; }

    public BigDecimal getBasePriceStandard() { return baseStandardPrice; }
    public void setBasePriceStandard(BigDecimal price) { this.baseStandardPrice = price; }

    public BigDecimal getBasePricePremium() { return basePremiumPrice; }
    public void setBasePricePremium(BigDecimal price) { this.basePremiumPrice = price; }

    public BigDecimal getBasePriceVip() { return baseVipPrice; }
    public void setBasePriceVip(BigDecimal price) { this.baseVipPrice = price; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(int bookedSeats) { this.bookedSeats = bookedSeats; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
