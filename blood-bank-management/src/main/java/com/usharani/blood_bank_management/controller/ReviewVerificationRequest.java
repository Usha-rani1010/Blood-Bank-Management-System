package com.usharani.blood_bank_management.controller;

import com.usharani.blood_bank_management.model.VerificationStatus;

import jakarta.validation.constraints.NotNull;

public class ReviewVerificationRequest {

    @NotNull(message = "Verification status is required")
    private VerificationStatus status;

    private String rejectionReason;

    public ReviewVerificationRequest() {
    }

    public ReviewVerificationRequest(VerificationStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public VerificationStatus getStatus() {
        return status;
    }

    public void setStatus(VerificationStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
