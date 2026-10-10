package com.eventpass.repository;

import com.eventpass.model.SeatLock;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface SeatLockRepository extends MongoRepository<SeatLock, String> {

    List<SeatLock> findByLockToken(String lockToken);

    Optional<SeatLock> findFirstByLockToken(String lockToken);

    Optional<SeatLock> findByEventSeatIdAndActiveIsTrueAndExpiresAtAfter(String eventSeatId, Instant now);

    Optional<SeatLock> findByEventIdAndSeatCodeAndActiveIsTrueAndExpiresAtAfter(String eventId, String seatCode, Instant now);

    List<SeatLock> findByEventIdAndActiveIsTrueAndExpiresAtAfter(String eventId, Instant now);

    List<SeatLock> findByUserIdAndActiveIsTrueAndExpiresAtAfter(String userId, Instant now);

    List<SeatLock> findByActiveIsTrueAndExpiresAtBefore(Instant now);

    List<SeatLock> findByExpiresAtBefore(Instant now);

    void deleteByUserIdAndEventId(String userId, String eventId);

    void deleteByLockToken(String lockToken);
}
