package com.usharani.blood_bank_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.usharani.blood_bank_management.model.BloodInventory;
import com.usharani.blood_bank_management.model.BloodRequest;
import com.usharani.blood_bank_management.repository.BloodInventoryRepository;
import com.usharani.blood_bank_management.repository.BloodRequestRepository;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository repository;

    @Autowired
    private BloodInventoryRepository inventoryRepository;


    // Add Request
    public BloodRequest saveRequest(BloodRequest request) {

        // Every new request starts as Pending
        request.setStatus("Pending");

        return repository.save(request);
    }


    // Get All Requests
    public List<BloodRequest> getAllRequests() {

        return repository.findAll();

    }


    // Get Request By ID
    public BloodRequest getRequestById(Long id) {

        return repository.findById(id).orElse(null);

    }


    // Update Request
    @Transactional
    public BloodRequest updateRequest(
            Long id,
            BloodRequest request) {

        BloodRequest existing =
                repository.findById(id).orElse(null);


        if (existing == null) {

            return null;

        }


        String oldStatus = existing.getStatus();
        String newStatus = request.getStatus();


        // ------------------------------------------------
        // PENDING → APPROVED
        // ------------------------------------------------

        if (oldStatus.equalsIgnoreCase("Pending")
                && newStatus.equalsIgnoreCase("Approved")) {

            BloodInventory inventory =
                    inventoryRepository
                            .findByBloodGroup(request.getBloodGroup())
                            .orElse(null);


            // Blood group does not exist
            if (inventory == null) {

                throw new RuntimeException(
                        "No blood inventory available for "
                        + request.getBloodGroup()
                );

            }


            // Not enough blood
            if (inventory.getAvailableUnits()
                    < request.getUnitsRequired()) {

                throw new RuntimeException(
                        "Not enough "
                        + request.getBloodGroup()
                        + " blood available. Available units: "
                        + inventory.getAvailableUnits()
                );

            }


            // Deduct blood units
            inventory.setAvailableUnits(
                    inventory.getAvailableUnits()
                    - request.getUnitsRequired()
            );


            inventoryRepository.save(inventory);
        }


        // ------------------------------------------------
        // APPROVED → PENDING / REJECTED / CANCELLED
        // Return blood to inventory
        // ------------------------------------------------
        else if (oldStatus.equalsIgnoreCase("Approved")
                && (newStatus.equalsIgnoreCase("Pending")
                    || newStatus.equalsIgnoreCase("Rejected")
                    || newStatus.equalsIgnoreCase("Cancelled"))) {

            BloodInventory inventory =
                    inventoryRepository
                            .findByBloodGroup(existing.getBloodGroup())
                            .orElse(null);

            if (inventory != null) {
                inventory.setAvailableUnits(
                        inventory.getAvailableUnits()
                        + existing.getUnitsRequired()
                );
                inventoryRepository.save(inventory);
            }
        }

        // ------------------------------------------------
        // APPROVED → COMPLETED
        // No inventory change (blood is fulfilled)
        // ------------------------------------------------

        // ------------------------------------------------
        // Update request information
        // ------------------------------------------------
        existing.setPatientName(request.getPatientName());
        existing.setBloodGroup(request.getBloodGroup());
        existing.setUnitsRequired(request.getUnitsRequired());
        existing.setHospital(request.getHospital());
        existing.setStatus(newStatus);

        return repository.save(existing);
    }

    // Delete Request
    @Transactional
    public void deleteRequest(Long id) {
        BloodRequest existing = repository.findById(id).orElse(null);
        if (existing != null) {
            // If request was approved and not completed, restore blood units on deletion
            if ("Approved".equalsIgnoreCase(existing.getStatus())) {
                BloodInventory inventory = inventoryRepository
                        .findByBloodGroup(existing.getBloodGroup())
                        .orElse(null);
                if (inventory != null) {
                    inventory.setAvailableUnits(
                            inventory.getAvailableUnits() + existing.getUnitsRequired()
                    );
                    inventoryRepository.save(inventory);
                }
            }
            repository.deleteById(id);
        }
    }

} 