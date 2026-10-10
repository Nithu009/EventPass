package com.eventpass.service;

import com.eventpass.dto.PricingRuleDto;
import com.eventpass.model.Event;
import com.eventpass.model.PricingRule;
import com.eventpass.model.enums.PricingTriggerType;
import com.eventpass.model.enums.SeatCategory;
import com.eventpass.repository.PricingRuleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class PricingEngineService {

    private final PricingRuleRepository pricingRuleRepository;

    public PricingEngineService(PricingRuleRepository pricingRuleRepository) {
        this.pricingRuleRepository = pricingRuleRepository;
    }

    /**
     * Compute the dynamic price for a seat based on category, event demand, and time proximity.
     * Guaranteed bounds: clamped within minPrice and maxPrice.
     */
    public BigDecimal calculateDynamicPrice(Event event, SeatCategory category, int totalSeats, int bookedOrLockedSeats) {
        BigDecimal basePrice = switch (category) {
            case VIP -> event.getBasePriceVip() != null ? event.getBasePriceVip() : new BigDecimal("2000.00");
            case PREMIUM -> event.getBasePricePremium() != null ? event.getBasePricePremium() : new BigDecimal("1000.00");
            case STANDARD -> event.getBasePriceStandard() != null ? event.getBasePriceStandard() : new BigDecimal("500.00");
        };

        if (totalSeats <= 0) {
            return basePrice;
        }

        // Calculate occupancy percentage (e.g. 75.0%)
        double occupancyRatio = (double) bookedOrLockedSeats / totalSeats;
        BigDecimal occupancyPercentage = BigDecimal.valueOf(occupancyRatio * 100.0).setScale(2, RoundingMode.HALF_UP);

        // Calculate hours before event start
        Instant now = Instant.now();
        long hoursBeforeEvent = 999;
        if (event.getStartTime() != null && event.getStartTime().isAfter(now)) {
            hoursBeforeEvent = Duration.between(now, event.getStartTime()).toHours();
        }

        // Fetch active rules applicable for this event or global (eventId == null)
        List<PricingRule> activeRules = pricingRuleRepository.findByActiveTrue();

        BigDecimal compoundMultiplier = BigDecimal.ONE;
        BigDecimal minBound = basePrice.multiply(new BigDecimal("0.70")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal maxBound = basePrice.multiply(new BigDecimal("2.50")).setScale(2, RoundingMode.HALF_UP);

        for (PricingRule rule : activeRules) {
            // Check if rule applies to this event or is global
            if (rule.getEventId() != null && !rule.getEventId().equals(event.getId())) {
                continue;
            }

            // Check if category matches or is null (applies to all categories)
            if (rule.getCategory() != null && rule.getCategory() != category) {
                continue;
            }

            // Demand threshold rule
            if (rule.getTriggerType() == PricingTriggerType.DEMAND_THRESHOLD) {
                if (rule.getThresholdPercentage() != null && occupancyPercentage.compareTo(rule.getThresholdPercentage()) >= 0) {
                    compoundMultiplier = compoundMultiplier.multiply(rule.getMultiplier());
                }
            }

            // Time decay or surge rule
            if (rule.getTriggerType() == PricingTriggerType.TIME_BEFORE_EVENT) {
                if (rule.getHoursBeforeEvent() != null && hoursBeforeEvent <= rule.getHoursBeforeEvent() && hoursBeforeEvent >= 0) {
                    compoundMultiplier = compoundMultiplier.multiply(rule.getMultiplier());
                }
            }

            // Explicit category multiplier
            if (rule.getTriggerType() == PricingTriggerType.CATEGORY_MULTIPLIER) {
                compoundMultiplier = compoundMultiplier.multiply(rule.getMultiplier());
            }

            if (rule.getMinPrice() != null && rule.getMinPrice().compareTo(minBound) > 0) {
                minBound = rule.getMinPrice();
            }
            if (rule.getMaxPrice() != null && rule.getMaxPrice().compareTo(maxBound) < 0) {
                maxBound = rule.getMaxPrice();
            }
        }

        BigDecimal calculated = basePrice.multiply(compoundMultiplier).setScale(2, RoundingMode.HALF_UP);

        // Clamp between bounds
        if (calculated.compareTo(minBound) < 0) {
            calculated = minBound;
        } else if (calculated.compareTo(maxBound) > 0) {
            calculated = maxBound;
        }

        return calculated;
    }

    public List<PricingRule> getAllRules() {
        return pricingRuleRepository.findAll();
    }

    public PricingRule createRule(PricingRuleDto dto) {
        PricingRule rule = new PricingRule();
        rule.setName(dto.getName());
        rule.setEventId(dto.getEventId());
        rule.setTriggerType(dto.getTriggerType());
        rule.setThresholdPercentage(dto.getThresholdPercentage());
        rule.setHoursBeforeEvent(dto.getHoursBeforeEvent());
        rule.setCategory(dto.getCategory());
        rule.setMultiplier(dto.getMultiplier());
        rule.setMinPrice(dto.getMinPrice());
        rule.setMaxPrice(dto.getMaxPrice());
        rule.setActive(dto.isActive());
        return pricingRuleRepository.save(rule);
    }

    public void deleteRule(String id) {
        pricingRuleRepository.deleteById(id);
    }
}
