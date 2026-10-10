package com.eventpass.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {

    @NotBlank(message = "Booking ID is required")
    private String bookingId;

    private String paymentMethod = "CREDIT_CARD"; // CREDIT_CARD, UPI, NET_BANKING
    private String cardLastFour = "4242";
    private boolean simulateSuccess = true;

    public PaymentRequest() {}

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }
    public boolean isSimulateSuccess() { return simulateSuccess; }
    public void setSimulateSuccess(boolean simulateSuccess) { this.simulateSuccess = simulateSuccess; }
}
