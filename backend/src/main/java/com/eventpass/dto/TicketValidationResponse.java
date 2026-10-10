package com.eventpass.dto;

import com.eventpass.model.enums.SeatCategory;

import java.time.Instant;

public class TicketValidationResponse {

    // Possible values: VALID, ALREADY_SCANNED, INVALID
    private String scanStatus;

    private String ticketId;
    private String ticketNumber;
    private String eventTitle;
    private String seatCode;
    private SeatCategory seatCategory;
    private String attendeeName;
    private String attendeeEmail;

    private boolean valid;
    private boolean alreadyScanned;
    private String scannedBy;       // who previously scanned (for duplicates)
    private Instant previousScanAt; // when was the duplicate scan

    private String statusMessage;
    private Instant validatedAt;

    public TicketValidationResponse() {}

    // Constructor for VALID first scan
    public static TicketValidationResponse firstScan(
            String ticketId, String ticketNumber, String eventTitle,
            String seatCode, SeatCategory seatCategory,
            String attendeeName, String attendeeEmail, Instant scannedAt) {
        TicketValidationResponse r = new TicketValidationResponse();
        r.scanStatus = "VALID";
        r.ticketId = ticketId;
        r.ticketNumber = ticketNumber;
        r.eventTitle = eventTitle;
        r.seatCode = seatCode;
        r.seatCategory = seatCategory;
        r.attendeeName = attendeeName;
        r.attendeeEmail = attendeeEmail;
        r.valid = true;
        r.alreadyScanned = false;
        r.statusMessage = "VALID TICKET — ENTRY APPROVED";
        r.validatedAt = scannedAt;
        return r;
    }

    // Constructor for ALREADY_SCANNED
    public static TicketValidationResponse alreadyScanned(
            String ticketId, String ticketNumber, String eventTitle,
            String seatCode, SeatCategory seatCategory,
            String attendeeName, String attendeeEmail,
            String scannedBy, Instant previousScanAt) {
        TicketValidationResponse r = new TicketValidationResponse();
        r.scanStatus = "ALREADY_SCANNED";
        r.ticketId = ticketId;
        r.ticketNumber = ticketNumber;
        r.eventTitle = eventTitle;
        r.seatCode = seatCode;
        r.seatCategory = seatCategory;
        r.attendeeName = attendeeName;
        r.attendeeEmail = attendeeEmail;
        r.valid = false;
        r.alreadyScanned = true;
        r.scannedBy = scannedBy;
        r.previousScanAt = previousScanAt;
        r.statusMessage = "ALREADY SCANNED — ENTRY DENIED";
        r.validatedAt = Instant.now();
        return r;
    }

    // Constructor for INVALID
    public static TicketValidationResponse invalid(String token, String reason) {
        TicketValidationResponse r = new TicketValidationResponse();
        r.scanStatus = "INVALID";
        r.ticketNumber = token;
        r.valid = false;
        r.alreadyScanned = false;
        r.statusMessage = reason;
        r.validatedAt = Instant.now();
        return r;
    }

    // Legacy 11-arg constructor kept for backward compat
    public TicketValidationResponse(String ticketId, String ticketNumber, String eventTitle,
            String seatCode, SeatCategory seatCategory, String attendeeName, String attendeeEmail,
            boolean valid, String statusMessage, Instant validatedAt) {
        this.ticketId = ticketId;
        this.ticketNumber = ticketNumber;
        this.eventTitle = eventTitle;
        this.seatCode = seatCode;
        this.seatCategory = seatCategory;
        this.attendeeName = attendeeName;
        this.attendeeEmail = attendeeEmail;
        this.valid = valid;
        this.alreadyScanned = false;
        this.statusMessage = statusMessage;
        this.validatedAt = validatedAt;
        this.scanStatus = valid ? "VALID" : "INVALID";
    }

    // Getters & Setters
    public String getScanStatus() { return scanStatus; }
    public void setScanStatus(String scanStatus) { this.scanStatus = scanStatus; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public SeatCategory getSeatCategory() { return seatCategory; }
    public void setSeatCategory(SeatCategory seatCategory) { this.seatCategory = seatCategory; }
    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }
    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }
    public boolean isAlreadyScanned() { return alreadyScanned; }
    public void setAlreadyScanned(boolean alreadyScanned) { this.alreadyScanned = alreadyScanned; }
    public String getScannedBy() { return scannedBy; }
    public void setScannedBy(String scannedBy) { this.scannedBy = scannedBy; }
    public Instant getPreviousScanAt() { return previousScanAt; }
    public void setPreviousScanAt(Instant previousScanAt) { this.previousScanAt = previousScanAt; }
    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
    public Instant getValidatedAt() { return validatedAt; }
    public void setValidatedAt(Instant validatedAt) { this.validatedAt = validatedAt; }
}
