package com.hospital.system.controller;

import com.hospital.system.entity.Prescription;
import com.hospital.system.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<Prescription>> getAll(
            @RequestParam(required = false) Long patientId) {
        if (patientId != null) return ResponseEntity.ok(prescriptionService.getByPatient(patientId));
        return ResponseEntity.ok(prescriptionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getById(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<Prescription> create(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.create(prescription));
    }

    /** PATCH /api/prescriptions/{id}/status?status=DA_CAP_PHAT */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Prescription> updateStatus(@PathVariable Long id,
                                                     @RequestParam String status) {
        return ResponseEntity.ok(
            prescriptionService.updateStatus(id, Prescription.Status.valueOf(status))
        );
    }
}