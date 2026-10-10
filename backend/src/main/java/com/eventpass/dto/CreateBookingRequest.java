package com.eventpass.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateBookingRequest {

    @NotBlank(message = "Lock token is required to create a booking")
    private String lockToken;

    public CreateBookingRequest() {}

    public CreateBookingRequest(String lockToken) {
        this.lockToken = lockToken;
    }

    public String getLockToken() { return lockToken; }
    public void setLockToken(String lockToken) { this.lockToken = lockToken; }
}
