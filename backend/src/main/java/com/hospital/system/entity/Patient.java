package com.hospital.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
// @Data @NoArgsConstructor @Builder
public class Patient {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_code", unique = true, nullable = false, length = 20)
    private String patientCode;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(unique = true, length = 20)
    private String cccd;

    @Column(length = 15)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    private BloodType bloodType;

    @Column(name = "allergy_notes", columnDefinition = "TEXT")
    private String allergyNotes;

    @Enumerated(EnumType.STRING)
    private Status status = Status.DANG_CHO;

    @Column(name = "total_visits")
    private int totalVisits = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static PatientBuilder builder() {
        return new PatientBuilder();
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setPatientCode(String patientCode) {
        this.patientCode = patientCode;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public void setCccd(String cccd) {
        this.cccd = cccd;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }
    
    public void setAllergyNotes(String allergyNotes) {
        this.allergyNotes = allergyNotes;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public void setTotalVisits(int totalVisits) {
        this.totalVisits = totalVisits;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getId(){
        return this.id;
    }

    public String getPatientCode(){
        return this.patientCode;
    }

    public String getFullName(){
        return this.fullName;
    }

    public LocalDate getDateOfBirth(){
        return this.dateOfBirth;
    }

    public Gender getGender(){
        return this.gender;
    }

    public String getCccd(){
        return this.cccd;
    }

    public String getPhone(){
        return this.phone;
    }

    public String getEmail(){
        return this.email;
    }

    public String getAddress(){
        return this.address;
    }

    public BloodType getBloodType(){
        return this.bloodType;
    }

    public String getAllergyNotes(){
        return this.allergyNotes;
    }

    public Status getStatus(){
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Gender     { Nam, Nữ, Khác }
    public enum BloodType  { A, B, AB, O }
    public enum Status {
        DANG_CHO("Đang chờ"), DANG_KHAM("Đang khám"),
        HOAN_THANH("Hoàn thành"), NHAP_VIEN("Nhập viện");
        private final String label;
        Status(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    public Patient(){}

    public Patient(Long id, String patientCode, String fullName, LocalDate dateOfBirth, Gender gender, String cccd, String phone, String email, String address, BloodType bloodType, String allergyNotes, Status status, int totalVisits, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.patientCode = patientCode;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.cccd = cccd;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.bloodType = bloodType;
        this.allergyNotes = allergyNotes;
        this.status = status;
        this.totalVisits = totalVisits;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}