package com.hospital.system.service;

import com.hospital.system.entity.*;
import com.hospital.system.repository.*;
import lombok.RequiredArgsConstructor;

// Apache POI — explicit to avoid clash with iText
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// iText — explicit to avoid clash with POI
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
// @RequiredArgsConstructor
public class ReportService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillingRepository billingRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;

    @Autowired
    public ReportService(PatientRepository patientRepository,
                         AppointmentRepository appointmentRepository,
                         BillingRepository billingRepository,
                         PrescriptionRepository prescriptionRepository,
                         MedicineRepository medicineRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.billingRepository = billingRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicineRepository = medicineRepository;
    }

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ═══════════════════════════════════════
    // DASHBOARD STATS
    // ═══════════════════════════════════════
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPatients",      patientRepository.count());
        stats.put("todayPatients",      appointmentRepository.countByDate(LocalDate.now()));
        stats.put("waitingPatients",    patientRepository.countByStatus(Patient.Status.DANG_CHO));
        stats.put("todayRevenue",       billingRepository.sumRevenueByDate(LocalDate.now()).orElse(BigDecimal.ZERO));
        stats.put("totalDoctors",       0); // injected separately if needed
        stats.put("lowStockMedicines",  medicineRepository.findLowStock().size());
        return stats;
    }

    // ═══════════════════════════════════════
    // PDF: PATIENTS
    // ═══════════════════════════════════════
    public byte[] exportPatientsPdf() {
        List<Patient> patients = patientRepository.findAll();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc, com.itextpdf.kernel.geom.PageSize.A4.rotate());

            // Title
            doc.add(new Paragraph("DANH SÁCH BỆNH NHÂN")
                .setFontSize(18).setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(4));
            doc.add(new Paragraph("Ngày xuất: " + LocalDate.now().format(DATE_FMT))
                .setFontSize(10).setTextAlignment(TextAlignment.CENTER).setMarginBottom(16));

            // Table
            float[] colWidths = {60, 150, 70, 50, 90, 100, 110, 100};
            Table table = new Table(UnitValue.createPercentArray(colWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Header
            String[] headers = {"Mã BN", "Họ & Tên", "Ngày sinh", "GT", "CCCD", "Điện thoại", "Chuyên khoa", "Trạng thái"};
            for (String h : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontSize(9))
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(14, 165, 233))
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(6));
            }

            // Rows
            boolean odd = true;
            // for (Patient p : patients) {
            //     com.itextpdf.kernel.colors.Color rowBg = odd
            //         ? ColorConstants.WHITE
            //         : new com.itextpdf.kernel.colors.DeviceRgb(240, 246, 255);
            //     table.addCell(styledCell(p.getPatientCode(), rowBg));
            //     table.addCell(styledCell(p.getFullName(), rowBg));
            //     table.addCell(styledCell(p.getDateOfBirth().format(DATE_FMT), rowBg));
            //     table.addCell(styledCell(p.getGender().name(), rowBg));
            //     table.addCell(styledCell(p.getCccd() != null ? p.getCccd() : "—", rowBg));
            //     table.addCell(styledCell(p.getPhone() != null ? p.getPhone() : "—", rowBg));
            //     table.addCell(styledCell("—", rowBg));
            //     table.addCell(styledCell(p.getStatus().getLabel(), rowBg));
            //     odd = !odd;
            // }

            doc.add(table);
            doc.add(new Paragraph("\nTổng số: " + patients.size() + " bệnh nhân")
                .setFontSize(10).setBold());
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất PDF bệnh nhân: " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════
    // PDF: APPOINTMENTS
    // ═══════════════════════════════════════
    public byte[] exportAppointmentsPdf(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByAppointmentDate(date);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document doc = new Document(pdfDoc, com.itextpdf.kernel.geom.PageSize.A4.rotate());

            doc.add(new Paragraph("DANH SÁCH LỊCH HẸN — " + date.format(DATE_FMT))
                .setFontSize(18).setBold()
                .setTextAlignment(TextAlignment.CENTER).setMarginBottom(16));

            float[] colWidths = {80, 140, 140, 60, 60, 100, 100};
            Table table = new Table(UnitValue.createPercentArray(colWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            String[] headers = {"Mã LH", "Bệnh nhân", "Bác sĩ", "Ngày", "Giờ", "Lý do", "Trạng thái"};
            for (String h : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontSize(9))
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(14, 165, 233))
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER).setPadding(6));
            }

            // boolean odd = true;
            // for (Appointment a : appointments) {
            //     com.itextpdf.kernel.colors.Color rowBg = odd ? ColorConstants.WHITE
            //         : new com.itextpdf.kernel.colors.DeviceRgb(240, 246, 255);
            //     table.addCell(styledCell(a.getAppointmentCode(), rowBg));
            //     table.addCell(styledCell(a.getPatient().getFullName(), rowBg));
            //     table.addCell(styledCell(a.getDoctor().getFullName(), rowBg));
            //     table.addCell(styledCell(a.getAppointmentDate().format(DATE_FMT), rowBg));
            //     table.addCell(styledCell(a.getAppointmentTime().toString(), rowBg));
            //     table.addCell(styledCell(a.getReason() != null ? a.getReason() : "—", rowBg));
            //     table.addCell(styledCell(a.getStatus().getLabel(), rowBg));
            //     odd = !odd;
            // }

            doc.add(table);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất PDF lịch hẹn: " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════
    // PDF: SINGLE PRESCRIPTION
    // ═══════════════════════════════════════
    // public byte[] exportPrescriptionPdf(Long prescriptionId) {
    //     Prescription rx = prescriptionRepository.findById(prescriptionId)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc"));
    //     try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
    //         PdfWriter writer = new PdfWriter(baos);
    //         PdfDocument pdfDoc = new PdfDocument(writer);
    //         Document doc = new Document(pdfDoc);

    //         // Header
    //         doc.add(new Paragraph("BỆNH VIỆN ĐA KHOA PHÚC YÊN")
    //             .setFontSize(14).setBold().setTextAlignment(TextAlignment.CENTER));
    //         doc.add(new Paragraph("123 Đường Ngô Gia Tự, Phúc Yên, Vĩnh Phúc | Tel: 0211 3868 xxx")
    //             .setFontSize(9).setTextAlignment(TextAlignment.CENTER).setMarginBottom(10));

    //         doc.add(new Paragraph("ĐƠN THUỐC ĐIỆN TỬ")
    //             .setFontSize(18).setBold().setTextAlignment(TextAlignment.CENTER)
    //             .setMarginBottom(4));
    //         doc.add(new Paragraph("Mã đơn: " + rx.getPrescriptionCode() + "   |   Ngày: "
    //             + rx.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
    //             .setFontSize(10).setTextAlignment(TextAlignment.CENTER).setMarginBottom(16));

    //         // Patient Info
    //         doc.add(new Paragraph("THÔNG TIN BỆNH NHÂN").setFontSize(11).setBold());
    //         doc.add(new Paragraph("Họ tên: " + rx.getPatient().getFullName()
    //             + "   |   Ngày sinh: " + rx.getPatient().getDateOfBirth().format(DATE_FMT)
    //             + "   |   Giới tính: " + rx.getPatient().getGender().name()).setFontSize(10));
    //         doc.add(new Paragraph("Địa chỉ: " + (rx.getPatient().getAddress() != null ? rx.getPatient().getAddress() : "—")).setFontSize(10).setMarginBottom(8));

    //         // Diagnosis
    //         doc.add(new Paragraph("Chẩn đoán: " + (rx.getDiagnosis() != null ? rx.getDiagnosis() : "—"))
    //             .setFontSize(11).setBold().setMarginBottom(10));

    //         // Medicine Table
    //         Table table = new Table(UnitValue.createPercentArray(new float[]{40, 15, 20, 25}));
    //         table.setWidth(UnitValue.createPercentValue(100));
    //         for (String h : new String[]{"Tên thuốc", "Số lượng", "Đơn giá", "Thành tiền"}) {
    //             table.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontSize(10))
    //                 .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(14, 165, 233))
    //                 .setFontColor(ColorConstants.WHITE).setPadding(6));
    //         }
    //         for (PrescriptionItem item : rx.getItems()) {
    //             table.addCell(new Cell().add(new Paragraph(item.getMedicine().getName()).setFontSize(10)).setPadding(5));
    //             table.addCell(new Cell().add(new Paragraph(item.getQuantity() + " " + item.getMedicine().getUnit()).setFontSize(10)).setPadding(5));
    //             table.addCell(new Cell().add(new Paragraph(formatVnd(item.getUnitPrice())).setFontSize(10)).setPadding(5));
    //             table.addCell(new Cell().add(new Paragraph(formatVnd(item.getSubtotal())).setFontSize(10)).setPadding(5));
    //         }
    //         doc.add(table);

    //         // Total
    //         doc.add(new Paragraph("\nTổng tiền: " + formatVnd(rx.getTotalAmount()))
    //             .setFontSize(13).setBold().setTextAlignment(TextAlignment.RIGHT));

    //         // Doctor signature
    //         doc.add(new Paragraph("\n\n\nBác sĩ kê đơn: " + rx.getDoctor().getFullName())
    //             .setFontSize(10).setTextAlignment(TextAlignment.RIGHT));

    //         doc.close();
    //         return baos.toByteArray();
    //     } catch (Exception e) {
    //         throw new RuntimeException("Lỗi xuất PDF đơn thuốc: " + e.getMessage(), e);
    //     }
    // }

    // ═══════════════════════════════════════
    // EXCEL: PATIENTS
    // ═══════════════════════════════════════
    public byte[] exportPatientsExcel() {
        List<Patient> patients = patientRepository.findAll();
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            XSSFSheet sheet = wb.createSheet("Bệnh nhân");

            // Header style
            CellStyle headerStyle = createHeaderStyle(wb);
            CellStyle dataStyle   = createDataStyle(wb);
            CellStyle altStyle    = createAltDataStyle(wb);

            // Title
            Row titleRow = sheet.createRow(0);
            org.apache.poi.ss.usermodel.Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DANH SÁCH BỆNH NHÂN — Ngày: " + LocalDate.now().format(DATE_FMT));
            CellStyle titleStyle = wb.createCellStyle();
            Font titleFont = wb.createFont();
            titleFont.setBold(true); titleFont.setFontHeightInPoints((short)14);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));

            // Header row
            String[] headers = {"Mã BN","Họ & Tên","Ngày sinh","Giới tính","CCCD","Điện thoại","Địa chỉ","Trạng thái"};
            Row hRow = sheet.createRow(2);
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell c = hRow.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
            }


            // Data rows
            int rowNum = 3;
            for (Patient p : patients) {
                Row row = sheet.createRow(rowNum);
                CellStyle style = (rowNum % 2 == 0) ? dataStyle : altStyle;
                setCellValue(row, 0, p.getPatientCode(), style);
                setCellValue(row, 1, p.getFullName(), style);
                setCellValue(row, 2, p.getDateOfBirth().format(DATE_FMT), style);
                setCellValue(row, 3, p.getGender().name(), style);
                setCellValue(row, 4, p.getCccd() != null ? p.getCccd() : "—", style);
                setCellValue(row, 5, p.getPhone() != null ? p.getPhone() : "—", style);
                setCellValue(row, 6, p.getAddress() != null ? p.getAddress() : "—", style);
                setCellValue(row, 7, p.getStatus().getLabel(), style);
                rowNum++;
            }

            // Auto size columns
            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);

            wb.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất Excel bệnh nhân: " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════
    // EXCEL: BILLING REPORT
    // ═══════════════════════════════════════
    public byte[] exportBillingExcel(LocalDate from, LocalDate to) {
        List<Billing> billings = billingRepository.findAll();
        try (XSSFWorkbook wb = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            XSSFSheet sheet = wb.createSheet("Hóa đơn");
            CellStyle headerStyle = createHeaderStyle(wb);
            CellStyle dataStyle   = createDataStyle(wb);
            CellStyle altStyle    = createAltDataStyle(wb);
            CellStyle moneyStyle  = createMoneyStyle(wb);

            // Title
            Row titleRow = sheet.createRow(0);
            org.apache.poi.ss.usermodel.Cell tc = titleRow.createCell(0);
            tc.setCellValue("BÁO CÁO DOANH THU: " + from.format(DATE_FMT) + " → " + to.format(DATE_FMT));
            CellStyle ts = wb.createCellStyle(); Font tf = wb.createFont();
            tf.setBold(true); tf.setFontHeightInPoints((short)13); ts.setFont(tf);
            tc.setCellStyle(ts);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));

            String[] headers = {"Mã HĐ","Bệnh nhân","Tiền khám","Tiền thuốc","Phí khác","Tổng tiền","Đã thanh toán","Trạng thái"};
            Row hRow = sheet.createRow(2);
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell c = hRow.createCell(i); c.setCellValue(headers[i]); c.setCellStyle(headerStyle);
            }

            int rowNum = 3;
            BigDecimal grandTotal = BigDecimal.ZERO;
            for (Billing b : billings) {
                Row row = sheet.createRow(rowNum);
                CellStyle style = (rowNum % 2 == 0) ? dataStyle : altStyle;
                setCellValue(row, 0, b.getBillCode(), style);
                setCellValue(row, 1, b.getPatient().getFullName(), style);
                setCellNumeric(row, 2, b.getConsultationFee().doubleValue(), moneyStyle);
                setCellNumeric(row, 3, b.getMedicineFee().doubleValue(), moneyStyle);
                setCellNumeric(row, 4, b.getOtherFee().doubleValue(), moneyStyle);
                setCellNumeric(row, 5, b.getTotalAmount().doubleValue(), moneyStyle);
                setCellNumeric(row, 6, b.getPaidAmount().doubleValue(), moneyStyle);
                setCellValue(row, 7, b.getStatus().getLabel(), style);
                grandTotal = grandTotal.add(b.getPaidAmount());
                rowNum++;
            }

            // Grand total row
            Row totalRow = sheet.createRow(rowNum + 1);
            CellStyle totalStyle = wb.createCellStyle();
            Font totalFont = wb.createFont(); totalFont.setBold(true); totalStyle.setFont(totalFont);
            org.apache.poi.ss.usermodel.Cell tc2 = totalRow.createCell(0); tc2.setCellValue("TỔNG DOANH THU"); tc2.setCellStyle(totalStyle);
            org.apache.poi.ss.usermodel.Cell tv = totalRow.createCell(6); tv.setCellValue(grandTotal.doubleValue()); tv.setCellStyle(moneyStyle);

            for (int i = 0; i < headers.length; i++) sheet.autoSizeColumn(i);

            wb.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất Excel billing: " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════
    private com.itextpdf.layout.element.Cell styledCell(String value, com.itextpdf.kernel.colors.Color bg) {
        return new com.itextpdf.layout.element.Cell()
                .add(new Paragraph(value != null ? value : "—").setFontSize(9))
                .setBackgroundColor(bg).setPadding(4);
    }

    private String formatVnd(BigDecimal amount) {
        return String.format("%,.0f đ", amount);
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont(); font.setBold(true); font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.SKY_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN); style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);   style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDataStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN); style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);   style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createAltDataStyle(Workbook wb) {
        CellStyle style = createDataStyle(wb);
        style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private CellStyle createMoneyStyle(Workbook wb) {
        CellStyle style = createDataStyle(wb);
        DataFormat fmt = wb.createDataFormat();
        style.setDataFormat(fmt.getFormat("#,##0"));
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }

    private void setCellValue(Row row, int col, String value, CellStyle style) {
        org.apache.poi.ss.usermodel.Cell c = row.createCell(col); c.setCellValue(value != null ? value : ""); c.setCellStyle(style);
    }

    private void setCellNumeric(Row row, int col, double value, CellStyle style) {
        org.apache.poi.ss.usermodel.Cell c = row.createCell(col); c.setCellValue(value); c.setCellStyle(style);
    }
}