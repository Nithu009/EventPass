package com.eventpass.repository;

import com.eventpass.model.Event;
import com.eventpass.model.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    List<Event> findByStatusAndCategory(EventStatus status, String category);

    Page<Event> findByStatusAndCategory(EventStatus status, String category, Pageable pageable);

    Page<Event> findByStatusAndEventDateAfter(EventStatus status, Instant after, Pageable pageable);

    Page<Event> findByStatusOrderByEventDateAsc(EventStatus status, Pageable pageable);

    @Query("{ 'status': ?0, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'description': { $regex: ?1, $options: 'i' } }, { 'category': { $regex: ?1, $options: 'i' } } ] }")
    Page<Event> searchByStatusAndKeyword(EventStatus status, String keyword, Pageable pageable);

    default Page<Event> searchPublishedByKeyword(String keyword, Pageable pageable) {
        return searchByStatusAndKeyword(EventStatus.PUBLISHED, keyword, pageable);
    }

    default Page<Event> findByStatusOrderByStartTimeAsc(EventStatus status, Pageable pageable) {
        return findByStatusOrderByEventDateAsc(status, pageable);
    }

    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);
}
