package com.eventpass.model;

import com.eventpass.model.enums.PricingTriggerType;
import com.eventpass.model.enums.SeatCategory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "pricing_rules")
public class PricingRule {

    @Id
    private String id;

    @Indexed
    private String eventId;

    private String name;
    private PricingTriggerType triggerType;
    private BigDecimal thresholdPercentage;
    private Integer hoursBeforeEvent;
    private SeatCategory category;
    private BigDecimal multiplier;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private boolean active = true;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public PricingRule() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRuleName() { return name; }
    public void setRuleName(String ruleName) { this.name = ruleName; }
    public PricingTriggerType getTriggerType() { return triggerType; }
    public void setTriggerType(PricingTriggerType triggerType) { this.triggerType = triggerType; }
    public BigDecimal getThresholdPercentage() { return thresholdPercentage; }
    public void setThresholdPercentage(BigDecimal thresholdPercentage) { this.thresholdPercentage = thresholdPercentage; }
    public Integer getHoursBeforeEvent() { return hoursBeforeEvent; }
    public void setHoursBeforeEvent(Integer hoursBeforeEvent) { this.hoursBeforeEvent = hoursBeforeEvent; }
    public SeatCategory getCategory() { return category; }
    public void setCategory(SeatCategory category) { this.category = category; }
    public BigDecimal getMultiplier() { return multiplier; }
    public void setMultiplier(BigDecimal multiplier) { this.multiplier = multiplier; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
