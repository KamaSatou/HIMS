package com.hospital.system.service;

import com.hospital.system.dto.AppointmentDTO;
import com.hospital.system.entity.*;
import com.hospital.system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<Appointment> getAll() { return appointmentRepository.findAll(); }

    public List<Appointment> getToday() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now());
    }

    public List<Appointment> getByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> getByPatient(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    public List<Appointment> getByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }

    public Appointment getById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn ID: " + id));
    }

    public Appointment create(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        Appointment apt = Appointment.builder()
                .appointmentCode(generateCode())
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime())
                .specialty(dto.getSpecialty() != null ? dto.getSpecialty() : doctor.getSpecialty())
                .reason(dto.getReason())
                .notes(dto.getNotes())
                .status(Appointment.Status.CHO_XAC_NHAN)
                .build();
        return appointmentRepository.save(apt);
    }

    public Appointment reschedule(Long id, LocalDate newDate, java.time.LocalTime newTime) {
        Appointment apt = getById(id);
        if (apt.getStatus() == Appointment.Status.HOAN_THANH || apt.getStatus() == Appointment.Status.DA_HUY) {
            throw new RuntimeException("Không thể đổi lịch hẹn đã hoàn thành hoặc đã hủy");
        }
        apt.setAppointmentDate(newDate);
        apt.setAppointmentTime(newTime);
        apt.setStatus(Appointment.Status.CHO_XAC_NHAN);
        return appointmentRepository.save(apt);
    }

    public Appointment cancel(Long id, String reason) {
        Appointment apt = getById(id);
        apt.setStatus(Appointment.Status.DA_HUY);
        apt.setNotes((apt.getNotes() != null ? apt.getNotes() + " | " : "") + "Lý do hủy: " + reason);
        return appointmentRepository.save(apt);
    }

    public Appointment checkIn(Long id) {
        Appointment apt = getById(id);
        apt.setStatus(Appointment.Status.DA_CHECK_IN);
        return appointmentRepository.save(apt);
    }

    public Appointment confirm(Long id) {
        Appointment apt = getById(id);
        apt.setStatus(Appointment.Status.DA_XAC_NHAN);
        return appointmentRepository.save(apt);
    }

    private String generateCode() {
        long count = appointmentRepository.count();
        String date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now());
        return "APT" + date + String.format("%03d", count + 1);
    }

    public long countToday() {
        return appointmentRepository.countByDate(LocalDate.now());
    }
}