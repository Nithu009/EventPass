package com.eventpass.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class SeatLockResponse {

    private String lockToken;
    private String eventId;
    private List<String> lockedSeats;
    private Instant expiresAt;
    private long remainingSeconds;
    private BigDecimal estimatedTotal;

    public SeatLockResponse() {}

    public SeatLockResponse(String lockToken, String eventId, List<String> lockedSeats, Instant expiresAt, long remainingSeconds, BigDecimal estimatedTotal) {
        this.lockToken = lockToken;
        this.eventId = eventId;
        this.lockedSeats = lockedSeats;
        this.expiresAt = expiresAt;
        this.remainingSeconds = remainingSeconds;
        this.estimatedTotal = estimatedTotal;
    }

    public String getLockToken() { return lockToken; }
    public void setLockToken(String lockToken) { this.lockToken = lockToken; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public List<String> getLockedSeats() { return lockedSeats; }
    public void setLockedSeats(List<String> lockedSeats) { this.lockedSeats = lockedSeats; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public long getRemainingSeconds() { return remainingSeconds; }
    public void setRemainingSeconds(long remainingSeconds) { this.remainingSeconds = remainingSeconds; }
    public BigDecimal getEstimatedTotal() { return estimatedTotal; }
    public void setEstimatedTotal(BigDecimal estimatedTotal) { this.estimatedTotal = estimatedTotal; }
}
