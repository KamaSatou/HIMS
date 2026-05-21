package com.hospital.system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
// import com.hospital.system.entity.*;

@Entity
@Table(name = "billing")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Billing {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_code", unique = true, nullable = false, length = 30)
    private String billCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(name = "consultation_fee", precision = 12, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "medicine_fee", precision = 12, scale = 2)
    private BigDecimal medicineFee;

    @Column(name = "lab_fee", precision = 12, scale = 2)
    private BigDecimal labFee;

    @Column(name = "other_fee", precision = 12, scale = 2)
    private BigDecimal otherFee;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 15, scale = 2)
    private BigDecimal paidAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod = PaymentMethod.TIEN_MAT;

    @Enumerated(EnumType.STRING)
    private Status status = Status.CHO_THANH_TOAN;

    @Column(name = "insurance_code", length = 50)
    private String insuranceCode;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billed_by")
    private User billedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); }

    public void setId(Long id) {
        this.id = id;
    }
    
    public void setBillCode(String billCode) {
        this.billCode = billCode;
    }
    
    public void setPatient(Patient patient) {
        this.patient = patient;
    }
    
    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
    }
    
    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }
    
    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }
    
    public void setMedicineFee(BigDecimal medicineFee) {
        this.medicineFee = medicineFee;
    }

    public void setLabFee(BigDecimal labFee) {
        this.labFee = labFee;
    }
    
    public void setOtherFee(BigDecimal otherFee) {
        this.otherFee = otherFee;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public void setInsuranceCode(String insuranceCode) {
        this.insuranceCode = insuranceCode;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public void setBilledBy(User billedBy) {
        this.billedBy = billedBy;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public Long getId() {
        return this.id;
    }
    
    public String getBillCode() {
        return this.billCode;
    }
    
    public Patient getPatient() {
        return this.patient;
    }
    
    public Prescription getPrescription() {
        return this.prescription;
    }
    
    public Appointment getAppointment() {
        return this.appointment;
    }

    public BigDecimal getConsultationFee(){
        return this.consultationFee;
    }

    public BigDecimal getMedicineFee(){
        return this.medicineFee;
    }

    public BigDecimal getLabFee(){
        return this.labFee;
    }

    public BigDecimal getOtherFee(){
        return this.otherFee;
    }

    public BigDecimal getTotalAmount(){
        return this.totalAmount;
    }

    public BigDecimal getPaidAmount(){
        return this.paidAmount;
    }

    public Status getStatus(){
        return this.status;
    }

    public enum PaymentMethod {
        TIEN_MAT("Tiền mặt"), CHUYEN_KHOAN("Chuyển khoản"), THE("Thẻ"), BHYT("BHYT");
        private final String label;
        PaymentMethod(String label) { this.label = label; }
        public String getLabel() { return label; }
    }
    public enum Status {
        CHO_THANH_TOAN("Chờ thanh toán"), DA_THANH_TOAN("Đã thanh toán"), HOAN_TIEN("Hoàn tiền");
        private final String label;
        Status(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    // public enum Patient {
    //     TEST("Test");
    //     private final String fullName;

    //     private Patient(String fullName) {
    //         this.fullName = fullName;
    //     }
    //     public String getFullName(){return fullName;}
    // }
}