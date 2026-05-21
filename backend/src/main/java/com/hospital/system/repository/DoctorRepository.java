package com.hospital.system.repository;

import com.hospital.system.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorCode(String doctorCode);
    List<Doctor> findBySpecialty(String specialty);
    List<Doctor> findByStatus(Doctor.Status status);
    List<Doctor> findByShift(Doctor.Shift shift);
}