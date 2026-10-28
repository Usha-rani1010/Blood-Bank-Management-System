package com.usharani.blood_bank_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.usharani.blood_bank_management.model.Donor;
import com.usharani.blood_bank_management.model.VerificationStatus;
import com.usharani.blood_bank_management.service.DonorService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @Autowired
    private DonorService service;

    // Add Donor
    @PostMapping
    public Donor addDonor(@Valid @RequestBody Donor donor) {
        return service.saveDonor(donor);
    }

    // Get All Donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return service.getAllDonors();
    }

    // Get Donors Pending Verification (Admin / Super Admin)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/pending-verification")
    public List<Donor> getPendingVerification() {
        return service.getDonorsByStatus(VerificationStatus.PENDING);
    }

    // Get Donor By ID
    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return service.getDonorById(id);
    }

    // Update Donor
    @PutMapping("/{id}")
    public Donor updateDonor(@PathVariable Long id,
                             @Valid @RequestBody Donor donor) {
        return service.updateDonor(id, donor);
    }

    // Delete Donor
    @DeleteMapping("/{id}")
    public String deleteDonor(@PathVariable Long id) {
        service.deleteDonor(id);
        return "Donor Deleted Successfully!";
    }

    // Upload / Replace Proof Document (Certificate)
    @PostMapping("/{id}/certificate")
    public ResponseEntity<Donor> uploadCertificate(@PathVariable Long id,
                                                   @RequestParam("file") MultipartFile file) {
        Donor updated = service.uploadCertificate(id, file);
        return ResponseEntity.ok(updated);
    }

    // Download / Inline View Proof Document
    @GetMapping("/{id}/certificate")
    public ResponseEntity<Resource> getCertificate(@PathVariable Long id) {
        Donor donor = service.getDonorById(id);
        if (donor == null || donor.getCertificateFilename() == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = service.getCertificateResource(id);
        String contentType = donor.getCertificateContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + donor.getCertificateOriginalFilename() + "\"")
                .body(resource);
    }

    // Review Verification (Admin / Super Admin)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}/verification")
    public ResponseEntity<Donor> reviewVerification(@PathVariable Long id,
                                                    @Valid @RequestBody ReviewVerificationRequest request,
                                                    Authentication authentication) {
        String reviewer = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "Staff Reviewer";

        Donor updated = service.reviewVerification(id, request.getStatus(), request.getRejectionReason(), reviewer);
        return ResponseEntity.ok(updated);
    }
}