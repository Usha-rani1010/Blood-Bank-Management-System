package com.usharani.blood_bank_management.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.usharani.blood_bank_management.model.Donor;
import com.usharani.blood_bank_management.model.VerificationStatus;
import com.usharani.blood_bank_management.repository.DonorRepository;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Add Donor
    public Donor saveDonor(Donor donor) {
        if (donor.getVerificationStatus() == null) {
            donor.setVerificationStatus(VerificationStatus.NOT_SUBMITTED);
        }
        return donorRepository.save(donor);
    }

    // Get All Donors
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Get Donor By ID
    public Donor getDonorById(Long id) {
        return donorRepository.findById(id).orElse(null);
    }

    // Update Donor
    public Donor updateDonor(Long id, Donor donor) {
        Donor existing = donorRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        existing.setName(donor.getName());
        existing.setAge(donor.getAge());
        existing.setGender(donor.getGender());
        existing.setBloodGroup(donor.getBloodGroup());
        existing.setPhone(donor.getPhone());
        existing.setCity(donor.getCity());
        existing.setEmail(donor.getEmail());

        return donorRepository.save(existing);
    }

    // Delete Donor
    public void deleteDonor(Long id) {
        Donor donor = donorRepository.findById(id).orElse(null);
        if (donor != null) {
            if (donor.getCertificateFilename() != null) {
                fileStorageService.deleteFile(donor.getCertificateFilename());
            }
            donorRepository.deleteById(id);
        }
    }

    // Upload / Replace Certificate
    public Donor uploadCertificate(Long donorId, MultipartFile file) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found with ID: " + donorId));

        // Delete old file if present
        if (donor.getCertificateFilename() != null) {
            fileStorageService.deleteFile(donor.getCertificateFilename());
        }

        String storedFilename = fileStorageService.storeFile(file, donorId);

        donor.setCertificateFilename(storedFilename);
        donor.setCertificateOriginalFilename(file.getOriginalFilename());
        donor.setCertificateContentType(file.getContentType());
        donor.setCertificateSize(file.getSize());
        donor.setCertificateUploadedAt(LocalDateTime.now());
        donor.setVerificationStatus(VerificationStatus.PENDING);
        donor.setRejectionReason(null); // Reset rejection reason on new upload

        return donorRepository.save(donor);
    }

    // Get Certificate Resource
    public Resource getCertificateResource(Long donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found with ID: " + donorId));

        if (donor.getCertificateFilename() == null) {
            throw new IllegalArgumentException("Donor has not uploaded a certificate yet");
        }

        return fileStorageService.loadFileAsResource(donor.getCertificateFilename());
    }

    // Review Verification
    public Donor reviewVerification(Long donorId, VerificationStatus newStatus, String rejectionReason, String reviewedBy) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found with ID: " + donorId));

        donor.setVerificationStatus(newStatus);
        donor.setVerifiedAt(LocalDateTime.now());
        donor.setVerifiedBy(reviewedBy);

        if (newStatus == VerificationStatus.REJECTED || newStatus == VerificationStatus.RESUBMISSION_REQUIRED) {
            donor.setRejectionReason(rejectionReason);
        } else if (newStatus == VerificationStatus.VERIFIED) {
            donor.setRejectionReason(null);
        }

        return donorRepository.save(donor);
    }

    // Get Donors by Status
    public List<Donor> getDonorsByStatus(VerificationStatus status) {
        return donorRepository.findByVerificationStatus(status);
    }
}