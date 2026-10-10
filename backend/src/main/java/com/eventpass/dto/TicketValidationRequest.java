package com.eventpass.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketValidationRequest {

    @NotBlank(message = "Validation token is required")
    private String token;

    public TicketValidationRequest() {}

    public TicketValidationRequest(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
