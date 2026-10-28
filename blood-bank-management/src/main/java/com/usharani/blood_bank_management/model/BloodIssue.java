package com.usharani.blood_bank_management.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "blood_issues")
public class BloodIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "issue_number", nullable = false, unique = true)
    private String issueNumber;

    @NotNull(message = "Request ID is required")
    @Column(name = "request_id", nullable = false)
    private Long requestId;

    @NotBlank(message = "Patient name is required")
    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @NotBlank(message = "Blood group is required")
    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Min(value = 1, message = "At least 1 unit must be issued")
    @Column(name = "units_issued", nullable = false)
    private int unitsIssued;

    @NotBlank(message = "Hospital is required")
    @Column(name = "hospital", nullable = false)
    private String hospital;

    @Column(name = "doctor_name")
    private String doctorName;

    @NotBlank(message = "Recipient / Collector name is required")
    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @NotBlank(message = "Recipient contact phone is required")
    @Column(name = "recipient_phone", nullable = false)
    private String recipientPhone;

    @Column(name = "issued_by", nullable = false)
    private String issuedBy;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "remarks", length = 500)
    private String remarks;

    public BloodIssue() {
    }

    public BloodIssue(String issueNumber, Long requestId, String patientName,
                      String bloodGroup, int unitsIssued, String hospital,
                      String doctorName, String recipientName, String recipientPhone,
                      String issuedBy, LocalDateTime issuedAt, String remarks) {
        this.issueNumber = issueNumber;
        this.requestId = requestId;
        this.patientName = patientName;
        this.bloodGroup = bloodGroup;
        this.unitsIssued = unitsIssued;
        this.hospital = hospital;
        this.doctorName = doctorName;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.issuedBy = issuedBy;
        this.issuedAt = issuedAt;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(String issueNumber) {
        this.issueNumber = issueNumber;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public int getUnitsIssued() {
        return unitsIssued;
    }

    public void setUnitsIssued(int unitsIssued) {
        this.unitsIssued = unitsIssued;
    }

    public String getHospital() {
        return hospital;
    }

    public void setHospital(String hospital) {
        this.hospital = hospital;
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

    public String getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
