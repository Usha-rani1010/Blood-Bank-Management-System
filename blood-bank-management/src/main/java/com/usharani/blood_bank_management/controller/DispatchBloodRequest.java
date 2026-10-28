package com.usharani.blood_bank_management.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DispatchBloodRequest {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    private String doctorName;

    @NotBlank(message = "Recipient / Collector name is required")
    private String recipientName;

    @NotBlank(message = "Recipient phone is required")
    private String recipientPhone;

    private String remarks;

    public DispatchBloodRequest() {
    }

    public DispatchBloodRequest(Long requestId, String doctorName, String recipientName, String recipientPhone, String remarks) {
        this.requestId = requestId;
        this.doctorName = doctorName;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.remarks = remarks;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
