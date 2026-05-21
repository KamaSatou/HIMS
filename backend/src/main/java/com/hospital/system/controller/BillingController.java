package com.hospital.system.controller;

import com.hospital.system.entity.Billing;
import com.hospital.system.service.BillingService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
// @RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @Autowired
    public BillingController(BillingService billingService){
        this.billingService = billingService;
    }
    
    @GetMapping
    public ResponseEntity<List<Billing>> getAll(
            @RequestParam(required = false) Long patientId) {
        if (patientId != null) return ResponseEntity.ok(billingService.getByPatient(patientId));
        return ResponseEntity.ok(billingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Billing> getById(@PathVariable Long id) {
        return ResponseEntity.ok(billingService.getById(id));
    }

    // @PostMapping
    // public ResponseEntity<Billing> create(@RequestBody Billing billing) {
    //     return ResponseEntity.ok(billingService.create(billing));
    // }

    /** PATCH /api/billing/{id}/pay */
    // @PatchMapping("/{id}/pay")
    // public ResponseEntity<Billing> pay(@PathVariable Long id,
    //                                    @RequestBody Map<String, String> body) {
    //     BigDecimal amount = new BigDecimal(body.get("amount"));
    //     Billing.PaymentMethod method = Billing.PaymentMethod.valueOf(
    //         body.getOrDefault("method", "TIEN_MAT")
    //     );
    //     return ResponseEntity.ok(billingService.pay(id, amount, method));
    // }

    @GetMapping("/today-revenue")
    public ResponseEntity<Map<String, Object>> getTodayRevenue() {
        return ResponseEntity.ok(Map.of(
            "revenue", billingService.getTodayRevenue(),
            "date", java.time.LocalDate.now().toString()
        ));
    }
}