package com.usharani.blood_bank_management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Min(value = 18, message = "Age must be at least 18")
    @Column(nullable = false)
    private int age;

    @NotBlank(message = "Gender is required")
    @Column(nullable = false)
    private String gender;

    @NotBlank(message = "Blood Group is required")
    @Column(nullable = false)
    private String bloodGroup;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.NOT_SUBMITTED;

    @Column(name = "certificate_filename")
    private String certificateFilename;

    @Column(name = "certificate_original_filename")
    private String certificateOriginalFilename;

    @Column(name = "certificate_content_type")
    private String certificateContentType;

    @Column(name = "certificate_size")
    private Long certificateSize;

    @Column(name = "certificate_uploaded_at")
    private java.time.LocalDateTime certificateUploadedAt;

    @Column(name = "verified_at")
    private java.time.LocalDateTime verifiedAt;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public Donor() {
        this.verificationStatus = VerificationStatus.NOT_SUBMITTED;
    }

    public Donor(Long id, String name, int age, String gender,
                 String bloodGroup, String phone,
                 String city, String email) {

        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.city = city;
        this.email = email;
        this.verificationStatus = VerificationStatus.NOT_SUBMITTED;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getCertificateFilename() {
        return certificateFilename;
    }

    public void setCertificateFilename(String certificateFilename) {
        this.certificateFilename = certificateFilename;
    }

    public String getCertificateOriginalFilename() {
        return certificateOriginalFilename;
    }

    public void setCertificateOriginalFilename(String certificateOriginalFilename) {
        this.certificateOriginalFilename = certificateOriginalFilename;
    }

    public String getCertificateContentType() {
        return certificateContentType;
    }

    public void setCertificateContentType(String certificateContentType) {
        this.certificateContentType = certificateContentType;
    }

    public Long getCertificateSize() {
        return certificateSize;
    }

    public void setCertificateSize(Long certificateSize) {
        this.certificateSize = certificateSize;
    }

    public java.time.LocalDateTime getCertificateUploadedAt() {
        return certificateUploadedAt;
    }

    public void setCertificateUploadedAt(java.time.LocalDateTime certificateUploadedAt) {
        this.certificateUploadedAt = certificateUploadedAt;
    }

    public java.time.LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(java.time.LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}