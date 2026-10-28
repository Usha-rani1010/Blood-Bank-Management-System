package com.usharani.blood_bank_management.service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.usharani.blood_bank_management.controller.DispatchBloodRequest;
import com.usharani.blood_bank_management.model.BloodIssue;
import com.usharani.blood_bank_management.model.BloodRequest;
import com.usharani.blood_bank_management.repository.BloodIssueRepository;
import com.usharani.blood_bank_management.repository.BloodRequestRepository;

@Service
public class BloodIssueService {

    @Autowired
    private BloodIssueRepository bloodIssueRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Transactional
    public BloodIssue dispatchBlood(DispatchBloodRequest dto, String issuedBy) {
        BloodRequest request = bloodRequestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Blood request not found with ID: " + dto.getRequestId()));

        if (!"approved".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException("Only Approved requests can be dispatched. Current status: " + request.getStatus());
        }

        if (bloodIssueRepository.existsByRequestId(request.getId())) {
            throw new IllegalStateException("This blood request has already been dispatched");
        }

        // Generate human-readable sequential issue number: ISS-2026-00001
        long nextSeq = bloodIssueRepository.count() + 1;
        String issueNumber = "ISS-" + Year.now().getValue() + "-" + String.format("%05d", nextSeq);

        // Transition request status to Completed
        request.setStatus("Completed");
        bloodRequestRepository.save(request);

        // Record official dispatch
        BloodIssue issue = new BloodIssue();
        issue.setIssueNumber(issueNumber);
        issue.setRequestId(request.getId());
        issue.setPatientName(request.getPatientName());
        issue.setBloodGroup(request.getBloodGroup());
        issue.setUnitsIssued(request.getUnitsRequired());
        issue.setHospital(request.getHospital());
        issue.setDoctorName(dto.getDoctorName() != null ? dto.getDoctorName().trim() : null);
        issue.setRecipientName(dto.getRecipientName().trim());
        issue.setRecipientPhone(dto.getRecipientPhone().trim());
        issue.setIssuedBy(issuedBy);
        issue.setIssuedAt(LocalDateTime.now());
        issue.setRemarks(dto.getRemarks() != null ? dto.getRemarks().trim() : null);

        return bloodIssueRepository.save(issue);
    }

    public List<BloodIssue> getAllIssues() {
        return bloodIssueRepository.findAllByOrderByIssuedAtDesc();
    }

    public BloodIssue getIssueById(Long id) {
        return bloodIssueRepository.findById(id).orElse(null);
    }

    public BloodIssue getIssueByRequestId(Long requestId) {
        return bloodIssueRepository.findByRequestId(requestId).orElse(null);
    }
}
