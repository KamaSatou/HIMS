package com.hospital.system.repository;

import com.hospital.system.entity.Patient;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPatientCode(String patientCode);
    Optional<Patient> findByCccd(String cccd);
    Optional<Patient> findByPhone(String phone);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "p.patientCode LIKE CONCAT('%', :q, '%') OR " +
           "p.cccd LIKE CONCAT('%', :q, '%') OR " +
           "p.phone LIKE CONCAT('%', :q, '%')")
    List<Patient> search(@Param("q") String query);

    List<Patient> findByStatus(Patient.Status status);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.status = :status")
    long countByStatus(@Param("status") Patient.Status status);

    @Query("SELECT MAX(CAST(SUBSTRING(p.patientCode, 3) AS int)) FROM Patient p")
    Integer findMaxPatientCodeNumber();
}