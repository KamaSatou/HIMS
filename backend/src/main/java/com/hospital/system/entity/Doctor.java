package com.hospital.system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_code", unique = true, nullable = false, length = 20)
    private String doctorCode;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String specialty;

    @Column(length = 50)
    private String degree;

    @Enumerated(EnumType.STRING)
    private Shift shift = Shift.CA_SANG;

    @Enumerated(EnumType.STRING)
    private Status status = Status.SAN_SANG;

    @Column(length = 15)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "room_number", length = 20)
    private String roomNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); }

    public enum Shift {
        CA_SANG("Ca sáng"), CA_CHIEU("Ca chiều"), CA_TRUC_DEM("Ca trực đêm");
        private final String label;
        Shift(String label) { this.label = label; }
        public String getLabel() { return label; }
    }
    public enum Status {
        SAN_SANG("Sẵn sàng"), DANG_KHAM("Đang khám"), NGHI("Nghỉ");
        private final String label;
        Status(String label) { this.label = label; }
        public String getLabel() { return label; }
    }
}