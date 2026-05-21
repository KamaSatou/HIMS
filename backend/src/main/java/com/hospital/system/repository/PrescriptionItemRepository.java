package com.hospital.system.repository;

import com.hospital.system.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    List<PrescriptionItem> findByPrescription_Id(Long prescriptionId);
    List<PrescriptionItem> findByMedicine_Id(Long medicineId);
}