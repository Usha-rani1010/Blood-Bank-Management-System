package com.usharani.blood_bank_management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.usharani.blood_bank_management.model.BloodInventory;
import com.usharani.blood_bank_management.repository.BloodInventoryRepository;

@Service
public class BloodInventoryService {

    @Autowired
    private BloodInventoryRepository repository;


    // ADD INVENTORY
    public BloodInventory saveInventory(BloodInventory inventory) {

        // Check whether this blood group already exists
        BloodInventory existing =
                repository.findByBloodGroup(inventory.getBloodGroup())
                          .orElse(null);


        // If blood group already exists,
        // add the new units to existing stock
        if (existing != null) {

            existing.setAvailableUnits(
                    existing.getAvailableUnits()
                    + inventory.getAvailableUnits()
            );

            return repository.save(existing);
        }


        // If blood group does not exist,
        // create a new record
        return repository.save(inventory);
    }


    // GET ALL INVENTORY
    public List<BloodInventory> getAllInventory() {

        return repository.findAll();

    }


    // GET INVENTORY BY ID
    public BloodInventory getInventoryById(Long id) {

        return repository.findById(id).orElse(null);

    }


    // UPDATE INVENTORY
    public BloodInventory updateInventory(
            Long id,
            BloodInventory inventory) {

        BloodInventory existing =
                repository.findById(id).orElse(null);


        if (existing == null) {
            return null;
        }


        existing.setBloodGroup(
                inventory.getBloodGroup()
        );

        existing.setAvailableUnits(
                inventory.getAvailableUnits()
        );


        return repository.save(existing);
    }


    // DELETE INVENTORY
    public void deleteInventory(Long id) {

        repository.deleteById(id);

    }
}

