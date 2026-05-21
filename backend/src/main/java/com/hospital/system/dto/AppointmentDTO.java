package com.hospital.system.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentDTO {

    private Long id;
    private String appointmentCode;

    @NotNull(message = "Patient ID không được để trống")
    private Long patientId;
    private String patientName;

    @NotNull(message = "Doctor ID không được để trống")
    private Long doctorId;
    private String doctorName;

    @NotNull(message = "Ngày hẹn không được để trống")
    private LocalDate appointmentDate;

    @NotNull(message = "Giờ hẹn không được để trống")
    private LocalTime appointmentTime;

    private String specialty;

    @NotBlank(message = "Lý do hẹn không được để trống")
    private String reason;

    private String status;
    private String notes;
}