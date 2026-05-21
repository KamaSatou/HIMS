package com.hospital.system.controller;

import com.hospital.system.dto.AppointmentDTO;
import com.hospital.system.entity.Appointment;
import com.hospital.system.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId) {
        if (patientId != null) return ResponseEntity.ok(appointmentService.getByPatient(patientId));
        if (doctorId != null)  return ResponseEntity.ok(appointmentService.getByDoctor(doctorId));
        if (date != null)      return ResponseEntity.ok(appointmentService.getByDate(LocalDate.parse(date)));
        return ResponseEntity.ok(appointmentService.getToday());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Appointment> create(@Valid @RequestBody AppointmentDTO dto) {
        return ResponseEntity.ok(appointmentService.create(dto));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirm(id));
    }

    @PatchMapping("/{id}/checkin")
    public ResponseEntity<Appointment> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.checkIn(id));
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> reschedule(@PathVariable Long id,
                                                   @RequestParam String date,
                                                   @RequestParam String time) {
        return ResponseEntity.ok(appointmentService.reschedule(id, LocalDate.parse(date), LocalTime.parse(time)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancel(@PathVariable Long id,
                                              @RequestParam(defaultValue = "") String reason) {
        return ResponseEntity.ok(appointmentService.cancel(id, reason));
    }
}