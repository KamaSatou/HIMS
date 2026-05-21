package com.hospital.system.controller;

import com.hospital.system.service.ReportService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
// @RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService){
        this.reportService = reportService;
    }

    /** GET /api/reports/stats — dashboard stats */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    /** GET /api/reports/export/patients/pdf */
    @GetMapping("/export/patients/pdf")
    public ResponseEntity<byte[]> exportPatientsPdf() {
        byte[] pdf = reportService.exportPatientsPdf();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patients.pdf")
                .body(pdf);
    }

    /** GET /api/reports/export/patients/excel */
    @GetMapping("/export/patients/excel")
    public ResponseEntity<byte[]> exportPatientsExcel() {
        byte[] excel = reportService.exportPatientsExcel();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patients.xlsx")
                .body(excel);
    }

    /** GET /api/reports/export/appointments/pdf?date=2026-05-16 */
    @GetMapping("/export/appointments/pdf")
    public ResponseEntity<byte[]> exportAppointmentsPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        byte[] pdf = reportService.exportAppointmentsPdf(date);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=appointments.pdf")
                .body(pdf);
    }

    /** GET /api/reports/export/billing/excel?from=2026-05-01&to=2026-05-31 */
    @GetMapping("/export/billing/excel")
    public ResponseEntity<byte[]> exportBillingExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        byte[] excel = reportService.exportBillingExcel(from, to);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=billing_report.xlsx")
                .body(excel);
    }

    /** GET /api/reports/export/prescription/{id}/pdf */
    // @GetMapping("/export/prescription/{id}/pdf")
    // @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PHARMACIST')")
    // public ResponseEntity<byte[]> exportPrescriptionPdf(@PathVariable Long id) {
    //     byte[] pdf = reportService.exportPrescriptionPdf(id);
    //     return ResponseEntity.ok()
    //             .contentType(MediaType.APPLICATION_PDF)
    //             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prescription_" + id + ".pdf")
    //             .body(pdf);
    // }
}