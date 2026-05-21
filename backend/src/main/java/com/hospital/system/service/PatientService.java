package com.hospital.system.service;

import com.hospital.system.entity.Patient;
import com.hospital.system.entity.Queue;
import com.hospital.system.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
// import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.hospital.system.repository.QueueRepository;

@Service
// @RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final QueueRepository queueRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository, QueueRepository queueRepository) {
        this.patientRepository = patientRepository;
        this.queueRepository = queueRepository;
    }

    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân ID: " + id));
    }

    public List<Patient> search(String query) {
        if (query == null || query.isBlank()) return getAll();
        return patientRepository.search(query.trim());
    }

    public Patient create(Patient patient) {
        patient.setPatientCode(generateCode());
        return patientRepository.save(patient);
    }

    public Patient update(Long id, Patient updated) {
        Patient existing = getById(id);
        existing.setFullName(updated.getFullName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setCccd(updated.getCccd());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        existing.setBloodType(updated.getBloodType());
        existing.setAllergyNotes(updated.getAllergyNotes());
        existing.setStatus(updated.getStatus());
        return patientRepository.save(existing);
    }

    public void delete(Long id) {
        Patient patient = getById(id);

        boolean hasActive = queueRepository.hasActiveQueue(id);
        if (hasActive) {
            throw new RuntimeException(
                "Không thể xóa! Bệnh nhân \"" + patient.getFullName() + 
                "\" đang có lịch khám đang chờ hoặc đang khám. " +
                "Vui lòng đợi Bệnh nhân hoàn thành."
            );
        }

        List<Queue> queues = queueRepository.findByPatientId(id);
        if (queues != null && !queues.isEmpty()) {
            queueRepository.deleteAll(queues);
        }

        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bệnh nhân ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    public Patient updateStatus(Long id, Patient.Status status) {
        Patient p = getById(id);
        p.setStatus(status);
        return patientRepository.save(p);
    }

    private String generateCode() {
        Integer max = patientRepository.findMaxPatientCodeNumber();
        int next = (max == null ? 0 : max) + 1;
        return String.format("BN%03d", next);
    }

    public long countByStatus(Patient.Status status) {
        return patientRepository.countByStatus(status);
    }
}