package com.usharani.blood_bank_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.usharani.blood_bank_management.repository.DonorRepository;
import com.usharani.blood_bank_management.repository.BloodRequestRepository;
import com.usharani.blood_bank_management.repository.BloodInventoryRepository;

@Service
public class DashboardService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private BloodInventoryRepository bloodInventoryRepository;

    public long getTotalDonors() {
        return donorRepository.count();
    }

    public long getTotalRequests() {
        return bloodRequestRepository.count();
    }

    public long getPendingRequests() {
        return bloodRequestRepository.countByStatus("Pending");
    }

    public int getTotalBloodUnits() {
        return bloodInventoryRepository.findAll()
                .stream()
                .mapToInt(inventory -> inventory.getAvailableUnits())
                .sum();
    }
}