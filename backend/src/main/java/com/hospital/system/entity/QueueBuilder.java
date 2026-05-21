package com.hospital.system.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class QueueBuilder {
    private Long id;
    private Patient patient;
    private Doctor doctor;
    private String specialty;
    private String roomName;
    private int queueNumber;
    private Queue.Priority priority = Queue.Priority.THUONG;
    private Queue.Status status = Queue.Status.DANG_CHO;
    private LocalDateTime checkInTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate queueDate;
    private String notes;

    public QueueBuilder() {}

    public QueueBuilder id(Long id) {
        this.id = id;
        return this;
    }

    public QueueBuilder patient(Patient patient) {
        this.patient = patient;
        return this;
    }
    
    public QueueBuilder doctor(Doctor doctor) {
        this.doctor = doctor;
        return this;
    }
    
    public QueueBuilder specialty(String specialty) {
        this.specialty = specialty;
        return this;
    }
    
    public QueueBuilder roomName(String roomName) {
        this.roomName = roomName;
        return this;
    }
    
    public QueueBuilder queueNumber(int queueNumber) {
        this.queueNumber = queueNumber;
        return this;
    }
    
    public QueueBuilder priority(Queue.Priority priority) {
        this.priority = priority;
        return this;
    }
    
    public QueueBuilder status(Queue.Status status) {
        this.status = status;
        return this;
    }
    
    public QueueBuilder checkInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
        return this;
    }
    
    public QueueBuilder startTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }
    
    public QueueBuilder endTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }
    
    public QueueBuilder queueDate(LocalDate queueDate) {
        this.queueDate = queueDate;
        return this;
    }
    
    public QueueBuilder notes(String notes) {
        this.notes = notes;
        return this;
    }

    public Queue build() {
        // Queue queue = new Queue();
        // queue.setId(this.id);
        // queue.setPatient(this.patient);
        // queue.setDoctor(this.doctor);
        // queue.setSpecialty(this.specialty);
        // queue.setRoomName(this.roomName);
        // queue.setQueueNumber(this.queueNumber);
        // queue.setPriority(this.priority);
        // queue.setStatus(this.status);
        // queue.setCheckInTime(this.checkInTime);
        // queue.setStartTime(this.startTime);
        // queue.setEndTime(this.endTime);
        // queue.setQueueDate(this.queueDate);
        // queue.setNotes(this.notes);
        return new Queue(
            this.id,
            this.patient,
            this.doctor,
            this.specialty,
            this.roomName,
            this.queueNumber,
            this.priority,
            this.status,
            this.checkInTime,
            this.startTime,
            this.endTime,
            this.queueDate,
            this.notes
        );
    }
}
