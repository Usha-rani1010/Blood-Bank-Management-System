package com.usharani.blood_bank_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.usharani.blood_bank_management.model.BloodIssue;
import com.usharani.blood_bank_management.service.BloodIssueService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/blood-issues")
public class BloodIssueController {

    @Autowired
    private BloodIssueService bloodIssueService;

    // Dispatch approved blood request (ADMIN or SUPER_ADMIN)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping("/dispatch")
    public ResponseEntity<BloodIssue> dispatchBlood(@Valid @RequestBody DispatchBloodRequest request,
                                                    Authentication authentication) {
        String issuedBy = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "Blood Bank Staff";

        BloodIssue issue = bloodIssueService.dispatchBlood(request, issuedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(issue);
    }

    // List all blood dispatch records
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping
    public List<BloodIssue> getAllIssues() {
        return bloodIssueService.getAllIssues();
    }

    // Get specific issue record
    @GetMapping("/{id}")
    public ResponseEntity<BloodIssue> getIssueById(@PathVariable Long id) {
        BloodIssue issue = bloodIssueService.getIssueById(id);
        if (issue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(issue);
    }

    // Get issue by linked request ID
    @GetMapping("/by-request/{requestId}")
    public ResponseEntity<BloodIssue> getIssueByRequestId(@PathVariable Long requestId) {
        BloodIssue issue = bloodIssueService.getIssueByRequestId(requestId);
        if (issue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(issue);
    }

    // Generate Printable HTML Hospital Receipt
    @GetMapping(value = "/{id}/receipt", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getPrintableReceipt(@PathVariable Long id) {
        BloodIssue issue = bloodIssueService.getIssueById(id);
        if (issue == null) {
            return ResponseEntity.notFound().build();
        }

        String html = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Blood Issue Dispatch Receipt - %s</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
                    .receipt-box { max-width: 800px; margin: auto; border: 2px solid #dc2626; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fee2e2; padding-bottom: 15px; margin-bottom: 25px; }
                    .logo { font-size: 28px; font-weight: bold; color: #dc2626; display: flex; align-items: center; gap: 8px; }
                    .badge { background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
                    .item { background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #dc2626; }
                    .item-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
                    .item-val { font-size: 16px; font-weight: 600; color: #0f172a; }
                    .blood-badge { display: inline-block; background: #dc2626; color: white; padding: 6px 16px; border-radius: 6px; font-size: 20px; font-weight: bold; }
                    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; padding-top: 30px; border-top: 1px dashed #cbd5e1; }
                    .sig-line { border-top: 1px solid #64748b; margin-top: 40px; padding-top: 8px; font-size: 13px; color: #475569; text-align: center; }
                    .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px; }
                    .print-btn { display: block; width: 100%%; max-width: 200px; margin: 20px auto 0; padding: 10px; background: #dc2626; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
                    @media print { .print-btn { display: none; } body { margin: 0; } .receipt-box { box-shadow: none; border: 1px solid #000; } }
                </style>
            </head>
            <body>
                <div class="receipt-box">
                    <div class="header">
                        <div class="logo">🩸 Blood Bank Dispatch Slip</div>
                        <div class="badge">OFFICIAL DISPATCH</div>
                    </div>

                    <div class="grid">
                        <div class="item">
                            <div class="item-label">Issue Number</div>
                            <div class="item-val" style="color: #dc2626; font-family: monospace;">%s</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Dispatch Date & Time</div>
                            <div class="item-val">%s</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Patient Name</div>
                            <div class="item-val">%s (Req #%d)</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Hospital / Clinic</div>
                            <div class="item-val">%s</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Blood Group Issued</div>
                            <div class="blood-badge">%s</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Quantity Issued</div>
                            <div class="item-val" style="font-size: 22px; color: #16a34a;">%d Unit(s)</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Prescribing Physician</div>
                            <div class="item-val">%s</div>
                        </div>
                        <div class="item">
                            <div class="item-label">Collected By (Recipient)</div>
                            <div class="item-val">%s (Ph: %s)</div>
                        </div>
                    </div>

                    %s

                    <div class="signatures">
                        <div>
                            <div style="font-size: 12px; color: #64748b;">Issued by Technician/Admin:</div>
                            <div style="font-weight: bold; margin-top: 5px;">%s</div>
                            <div class="sig-line">Authorized Blood Bank Signature & Stamp</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #64748b;">Received & Verified By:</div>
                            <div style="font-weight: bold; margin-top: 5px;">%s</div>
                            <div class="sig-line">Hospital Recipient Signature</div>
                        </div>
                    </div>

                    <div class="footer">
                        This is an official computer-generated medical dispatch receipt. For verification inquiries, contact the central blood bank facility.
                    </div>
                    <button class="print-btn" onclick="window.print()">🖨️ Print Dispatch Slip</button>
                </div>
            </body>
            </html>
            """.formatted(
                issue.getIssueNumber(),
                issue.getIssueNumber(),
                issue.getIssuedAt() != null ? issue.getIssuedAt().toString() : "",
                issue.getPatientName(),
                issue.getRequestId(),
                issue.getHospital(),
                issue.getBloodGroup(),
                issue.getUnitsIssued(),
                issue.getDoctorName() != null ? issue.getDoctorName() : "Attending Physician",
                issue.getRecipientName(),
                issue.getRecipientPhone(),
                issue.getRemarks() != null && !issue.getRemarks().isBlank()
                    ? "<div class=\"item\" style=\"margin-bottom: 25px;\"><div class=\"item-label\">Special Remarks</div><div class=\"item-val\">" + issue.getRemarks() + "</div></div>"
                    : "",
                issue.getIssuedBy(),
                issue.getRecipientName()
            );

        return ResponseEntity.ok(html);
    }
}
