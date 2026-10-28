package com.usharani.blood_bank_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.usharani.blood_bank_management.service.DashboardService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping
    public DashboardResponse getDashboard() {

        return new DashboardResponse(
                service.getTotalDonors(),
                service.getTotalBloodUnits(),
                service.getTotalRequests(),
                service.getPendingRequests()
        );
    }

    public static class DashboardResponse {

        private long totalDonors;
        private int totalBloodUnits;
        private long totalRequests;
        private long pendingRequests;

        public DashboardResponse(
                long totalDonors,
                int totalBloodUnits,
                long totalRequests,
                long pendingRequests) {

            this.totalDonors = totalDonors;
            this.totalBloodUnits = totalBloodUnits;
            this.totalRequests = totalRequests;
            this.pendingRequests = pendingRequests;
        }

        public long getTotalDonors() {
            return totalDonors;
        }

        public int getTotalBloodUnits() {
            return totalBloodUnits;
        }

        public long getTotalRequests() {
            return totalRequests;
        }

        public long getPendingRequests() {
            return pendingRequests;
        }
    }
}