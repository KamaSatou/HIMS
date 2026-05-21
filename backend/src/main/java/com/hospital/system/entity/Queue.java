package com.hospital.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue")
// @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Queue {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false, length = 100)
    private String specialty;

    @Column(name = "room_name", nullable = false, length = 100)
    private String roomName;

    @Column(name = "queue_number", nullable = false)
    private int queueNumber;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.THUONG;

    @Enumerated(EnumType.STRING)
    private Status status = Status.DANG_CHO;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "queue_date", nullable = false)
    private LocalDate queueDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Constructor Jakarta Persistence API

    public Queue(){}
    
    public Queue(Long id, Patient patient, Doctor doctor, String specialty, 
                 String roomName, int queueNumber, Priority priority, Status status,
                 LocalDateTime checkInTime, LocalDateTime startTime, 
                 LocalDateTime endTime, LocalDate queueDate, String notes) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.specialty = specialty;
        this.roomName = roomName;
        this.queueNumber = queueNumber;
        this.priority = priority;
        this.status = status;
        this.checkInTime = checkInTime;
        this.startTime = startTime;
        this.endTime = endTime;
        this.queueDate = queueDate;
        this.notes = notes;
    }

    // Getter
    public Long getId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public String getSpecialty() {
        return specialty;
    }

    public String getRoomName() {
        return roomName;
    }

    public int getQueueNumber() {
        return queueNumber;
    }

    public Priority getPriority() {
        return priority;
    }

    public Status getStatus() {
        return status;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public LocalDate getQueueDate() {
        return queueDate;
    }

    public String getNotes() {
        return notes;
    }

    // Setter

    public void setId(Long id) {
        this.id = id;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public void setQueueNumber(int queueNumber) {
        this.queueNumber = queueNumber;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setQueueDate(LocalDate queueDate) {
        this.queueDate = queueDate;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public enum Priority {
        THUONG("Thường"), UU_TIEN("Ưu tiên"), CAP_CUU("Cấp cứu");
        private final String label;
        Priority(String label) { this.label = label; }
        public String getLabel() { return label; }
    }
    public enum Status {
        DANG_CHO("Đang chờ"), DANG_KHAM("Đang khám"),
        HOAN_THANH("Hoàn thành"), BO_QUA("Bỏ qua");
        private final String label;
        Status(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    public static QueueBuilder builder(){
        return new QueueBuilder();
    }
}