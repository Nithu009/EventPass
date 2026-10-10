package com.eventpass.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Temporary seat hold. Created when user selects seats for checkout.
 * Expires after a configurable TTL (default 8 minutes).
 *
 * IMPORTANT: A TTL index on expiresAt is used ONLY for cleanup of stale documents.
 * Expiration enforcement is done explicitly in application logic by checking
 * expiresAt < Instant.now() before accepting a new lock request.
 *
 * Uniqueness: One active lock per (eventSeatId) combination is enforced
 * by the compound unique index, preventing concurrent users from locking the same seat.
 */
@Document(collection = "seat_locks")
@CompoundIndexes({
    @CompoundIndex(name = "active_lock_per_seat", def = "{'eventSeatId': 1, 'active': 1}", unique = false)
})
public class SeatLock {

    @Id
    private String id;

    @Indexed
    private String eventId;

    @Indexed
    private String eventSeatId;

    private String seatCode;

    @Indexed
    private String userId;

    @Indexed
    private String lockToken;

    private Instant lockedAt = Instant.now();

    /** TTL expiration — also indexed for TTL cleanup and expiration queries */
    @Indexed(expireAfterSeconds = 0)
    private Instant expiresAt;

    private boolean active = true;

    public SeatLock() {}

    public SeatLock(String eventId, String eventSeatId, String seatCode, String userId, String lockToken, Instant expiresAt) {
        this.eventId = eventId;
        this.eventSeatId = eventSeatId;
        this.seatCode = seatCode;
        this.userId = userId;
        this.lockToken = lockToken;
        this.expiresAt = expiresAt;
        this.lockedAt = Instant.now();
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }

    public String getEventSeatId() { return eventSeatId; }
    public void setEventSeatId(String eventSeatId) { this.eventSeatId = eventSeatId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getLockToken() { return lockToken; }
    public void setLockToken(String lockToken) { this.lockToken = lockToken; }

    public Instant getLockedAt() { return lockedAt; }
    public void setLockedAt(Instant lockedAt) { this.lockedAt = lockedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
