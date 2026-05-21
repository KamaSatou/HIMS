package com.hospital.system.controller;

import com.hospital.system.entity.Medicine;
import com.hospital.system.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<Medicine>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        if (q != null && !q.isBlank()) return ResponseEntity.ok(medicineService.search(q));
        if (category != null)          return ResponseEntity.ok(medicineService.getByCategory(category));
        return ResponseEntity.ok(medicineService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getById(id));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStock() {
        return ResponseEntity.ok(medicineService.getLowStock());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<Medicine> create(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.create(medicine));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<Medicine> update(@PathVariable Long id, @RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.update(id, medicine));
    }

    /** PATCH /api/medicines/{id}/restock?quantity=500 */
    @PatchMapping("/{id}/restock")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<Medicine> restock(@PathVariable Long id,
                                            @RequestParam int quantity) {
        return ResponseEntity.ok(medicineService.restock(id, quantity));
    }
}