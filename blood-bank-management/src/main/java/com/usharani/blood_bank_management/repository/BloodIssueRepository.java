package com.usharani.blood_bank_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usharani.blood_bank_management.model.BloodIssue;

public interface BloodIssueRepository extends JpaRepository<BloodIssue, Long> {

    Optional<BloodIssue> findByIssueNumber(String issueNumber);

    Optional<BloodIssue> findByRequestId(Long requestId);

    List<BloodIssue> findAllByOrderByIssuedAtDesc();

    boolean existsByRequestId(Long requestId);
}
