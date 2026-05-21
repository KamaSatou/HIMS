package com.hospital.system.repository;

import com.hospital.system.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient_IdOrderByVisitDateDesc(Long patientId);
    List<MedicalRecord> findByDoctor_Id(Long doctorId);
}