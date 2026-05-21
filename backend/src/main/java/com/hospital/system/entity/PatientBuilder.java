package com.hospital.system.entity;

import com.hospital.system.entity.Patient;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientBuilder {
  private Long id;
  
  private String patientCode;
  
  private String fullName;
  
  private LocalDate dateOfBirth;
  
  private Patient.Gender gender;
  
  private String cccd;
  
  private String phone;
  
  private String email;
  
  private String address;
  
  private Patient.BloodType bloodType;
  
  private String allergyNotes;
  
  private Patient.Status status;
  
  private int totalVisits;
  
  private LocalDateTime createdAt;
  
  private LocalDateTime updatedAt;
  
  public PatientBuilder id(Long id) {
    this.id = id;
    return this;
  }
  
  public PatientBuilder patientCode(String patientCode) {
    this.patientCode = patientCode;
    return this;
  }
  
  public PatientBuilder fullName(String fullName) {
    this.fullName = fullName;
    return this;
  }
  
  public PatientBuilder dateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
    return this;
  }
  
  public PatientBuilder gender(Patient.Gender gender) {
    this.gender = gender;
    return this;
  }
  
  public PatientBuilder cccd(String cccd) {
    this.cccd = cccd;
    return this;
  }
  
  public PatientBuilder phone(String phone) {
    this.phone = phone;
    return this;
  }
  
  public PatientBuilder email(String email) {
    this.email = email;
    return this;
  }
  
  public PatientBuilder address(String address) {
    this.address = address;
    return this;
  }
  
  public PatientBuilder bloodType(Patient.BloodType bloodType) {
    this.bloodType = bloodType;
    return this;
  }
  
  public PatientBuilder allergyNotes(String allergyNotes) {
    this.allergyNotes = allergyNotes;
    return this;
  }
  
  public PatientBuilder status(Patient.Status status) {
    this.status = status;
    return this;
  }
  
  public PatientBuilder totalVisits(int totalVisits) {
    this.totalVisits = totalVisits;
    return this;
  }
  
  public PatientBuilder createdAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
    return this;
  }
  
  public PatientBuilder updatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
    return this;
  }
  

  public Patient build() {
    return new Patient(this.id, this.patientCode, this.fullName, this.dateOfBirth, this.gender, 
                           this.cccd, this.phone, this.email, this.address, this.bloodType, 
                           this.allergyNotes, this.status, this.totalVisits, this.createdAt, this.updatedAt);
  }
  
  public String toString() {
    return "Patient.PatientBuilder(id=" + this.id + ", patientCode=" + this.patientCode + ", fullName=" + this.fullName + ", dateOfBirth=" + this.dateOfBirth + ", gender=" + this.gender + ", cccd=" + this.cccd + ", phone=" + this.phone + ", email=" + this.email + ", address=" + this.address + ", bloodType=" + this.bloodType + ", allergyNotes=" + this.allergyNotes + ", status=" + this.status + ", totalVisits=" + this.totalVisits + ", createdAt=" + this.createdAt + ", updatedAt=" + this.updatedAt + ")";
  }
}
