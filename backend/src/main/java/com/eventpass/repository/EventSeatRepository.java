package com.eventpass.repository;

import com.eventpass.model.EventSeat;
import com.eventpass.model.enums.EventSeatStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EventSeatRepository extends MongoRepository<EventSeat, String> {

    List<EventSeat> findByEventId(String eventId);

    List<EventSeat> findByEventIdOrderByRowLabelAscSeatNumberAsc(String eventId);

    List<EventSeat> findByEventIdAndStatus(String eventId, EventSeatStatus status);

    Optional<EventSeat> findByEventIdAndSeatCode(String eventId, String seatCode);

    List<EventSeat> findByIdIn(List<String> ids);

    long countByEventId(String eventId);

    long countByEventIdAndStatus(String eventId, EventSeatStatus status);
}
