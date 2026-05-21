package com.hospital.system.service;

import com.hospital.system.entity.Doctor;
import com.hospital.system.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<Doctor> getAll() { return doctorRepository.findAll(); }

    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ ID: " + id));
    }

    public List<Doctor> getBySpecialty(String specialty) {
        return doctorRepository.findBySpecialty(specialty);
    }

    public List<Doctor> getByShift(Doctor.Shift shift) {
        return doctorRepository.findByShift(shift);
    }

    public Doctor create(Doctor doctor) {
        long count = doctorRepository.count();
        doctor.setDoctorCode(String.format("BS%03d", count + 1));
        return doctorRepository.save(doctor);
    }

    public Doctor update(Long id, Doctor updated) {
        Doctor existing = getById(id);
        existing.setFullName(updated.getFullName());
        existing.setSpecialty(updated.getSpecialty());
        existing.setDegree(updated.getDegree());
        existing.setShift(updated.getShift());
        existing.setStatus(updated.getStatus());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setRoomNumber(updated.getRoomNumber());
        return doctorRepository.save(existing);
    }

    public Doctor updateStatus(Long id, Doctor.Status status) {
        Doctor d = getById(id);
        d.setStatus(status);
        return doctorRepository.save(d);
    }

    public void delete(Long id) {
        doctorRepository.deleteById(id);
    }
}