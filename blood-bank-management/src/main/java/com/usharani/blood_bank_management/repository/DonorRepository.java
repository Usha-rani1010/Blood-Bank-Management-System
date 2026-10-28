package com.usharani.blood_bank_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usharani.blood_bank_management.model.Donor;
import com.usharani.blood_bank_management.model.VerificationStatus;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByVerificationStatus(VerificationStatus status);
    List<Donor> findByBloodGroup(String bloodGroup);
    List<Donor> findByCityIgnoreCase(String city);
    List<Donor> findByBloodGroupAndCityIgnoreCase(String bloodGroup, String city);
}