package com.usharani.blood_bank_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usharani.blood_bank_management.model.BloodInventory;

public interface BloodInventoryRepository
        extends JpaRepository<BloodInventory, Long> {

    Optional<BloodInventory> findByBloodGroup(String bloodGroup);

}

