package com.usharani.blood_bank_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import com.usharani.blood_bank_management.model.BloodInventory;
import com.usharani.blood_bank_management.service.BloodInventoryService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/inventory")
public class BloodInventoryController {

    @Autowired
    private BloodInventoryService service;

    @PostMapping
    public BloodInventory addInventory(@RequestBody BloodInventory inventory) {
        return service.saveInventory(inventory);
    }

    @GetMapping
    public List<BloodInventory> getAllInventory() {
        return service.getAllInventory();
    }

    @GetMapping("/{id}")
    public BloodInventory getInventoryById(@PathVariable Long id) {
        return service.getInventoryById(id);
    }

    @PutMapping("/{id}")
    public BloodInventory updateInventory(@PathVariable Long id,
                                          @RequestBody BloodInventory inventory) {
        return service.updateInventory(id, inventory);
    }

    @DeleteMapping("/{id}")
    public String deleteInventory(@PathVariable Long id) {
        service.deleteInventory(id);
        return "Blood Inventory Deleted Successfully!";
    }
}