package com.hospital.system.service;

import com.hospital.system.entity.*;
import com.hospital.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineService medicineService;

    public List<Prescription> getAll() { return prescriptionRepository.findAll(); }

    public Prescription getById(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc ID: " + id));
    }

    public List<Prescription> getByPatient(Long patientId) {
        return prescriptionRepository.findByPatient_Id(patientId);
    }

    public Prescription create(Prescription prescription) {
        prescription.setPrescriptionCode(generateCode());
        recalcTotal(prescription);
        return prescriptionRepository.save(prescription);
    }

    public Prescription updateStatus(Long id, Prescription.Status status) {
        Prescription p = getById(id);
        // Trừ kho khi cấp phát
        if (status == Prescription.Status.DA_CAP_PHAT && p.getStatus() != Prescription.Status.DA_CAP_PHAT) {
            p.getItems().forEach(item ->
                medicineService.deductStock(item.getMedicine().getId(), item.getQuantity())
            );
        }
        p.setStatus(status);
        return prescriptionRepository.save(p);
    }

    private void recalcTotal(Prescription p) {
        BigDecimal total = p.getItems().stream()
                .map(PrescriptionItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        p.setTotalAmount(total);
    }

    private String generateCode() {
        long count = prescriptionRepository.count();
        return "RX" + LocalDate.now().getYear() + String.format("%03d", count + 1);
    }
}