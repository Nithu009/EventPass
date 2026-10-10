package com.eventpass.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class SeatLockRequest {

    @NotEmpty(message = "At least one seat code must be provided")
    @Size(max = 6, message = "Cannot lock more than 6 seats in a single reservation")
    private List<String> seatCodes;

    public SeatLockRequest() {}

    public SeatLockRequest(List<String> seatCodes) {
        this.seatCodes = seatCodes;
    }

    public List<String> getSeatCodes() { return seatCodes; }
    public void setSeatCodes(List<String> seatCodes) { this.seatCodes = seatCodes; }
}
