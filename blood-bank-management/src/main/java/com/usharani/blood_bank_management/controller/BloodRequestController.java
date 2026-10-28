package com.usharani.blood_bank_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.usharani.blood_bank_management.model.BloodRequest;
import com.usharani.blood_bank_management.service.BloodRequestService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService service;

    // Add Request
    @PostMapping
    public BloodRequest addRequest(@RequestBody BloodRequest request) {
        return service.saveRequest(request);
    }

    // Get All Requests
    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return service.getAllRequests();
    }

    // Get Request By ID
    @GetMapping("/{id}")
    public BloodRequest getRequestById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    // Update Request
    @PutMapping("/{id}")
    public BloodRequest updateRequest(
            @PathVariable Long id,
            @RequestBody BloodRequest request) {

        return service.updateRequest(id, request);
    }

    // Delete Request
    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {

        service.deleteRequest(id);

        return "Blood Request Deleted Successfully!";
    }
}