package com.eventpass.dto;

import com.eventpass.model.PricingRule;
import com.eventpass.model.enums.PricingTriggerType;
import com.eventpass.model.enums.SeatCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

public class PricingRuleDto {

    private String id;

    @NotBlank(message = "Rule name is required")
    private String name;

    private String eventId; // Optional: null = global rule

    @NotNull(message = "Trigger type is required")
    private PricingTriggerType triggerType;

    private BigDecimal thresholdPercentage;
    private Integer hoursBeforeEvent;
    private SeatCategory category;

    @NotNull(message = "Multiplier is required")
    @DecimalMin(value = "0.10", message = "Multiplier must be at least 0.10")
    private BigDecimal multiplier;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private boolean active = true;
    private Instant createdAt;

    public PricingRuleDto() {}

    public static PricingRuleDto fromEntity(PricingRule rule) {
        PricingRuleDto dto = new PricingRuleDto();
        dto.setId(rule.getId());
        dto.setName(rule.getName());
        dto.setEventId(rule.getEventId());
        dto.setTriggerType(rule.getTriggerType());
        dto.setThresholdPercentage(rule.getThresholdPercentage());
        dto.setHoursBeforeEvent(rule.getHoursBeforeEvent());
        dto.setCategory(rule.getCategory());
        dto.setMultiplier(rule.getMultiplier());
        dto.setMinPrice(rule.getMinPrice());
        dto.setMaxPrice(rule.getMaxPrice());
        dto.setActive(rule.isActive());
        dto.setCreatedAt(rule.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
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
