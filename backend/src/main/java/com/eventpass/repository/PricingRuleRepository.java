package com.eventpass.repository;

import com.eventpass.model.PricingRule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PricingRuleRepository extends MongoRepository<PricingRule, String> {

    @Query("{ 'active': true, $or: [ { 'eventId': ?0 }, { 'eventId': null } ] }")
    List<PricingRule> findActiveRulesForEvent(String eventId);

    List<PricingRule> findByEventIdAndActiveTrue(String eventId);

    List<PricingRule> findByActiveTrue();
}
