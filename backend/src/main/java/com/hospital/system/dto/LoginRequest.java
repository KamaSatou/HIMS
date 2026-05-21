package com.hospital.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// ── LoginRequest ──────────────────────────
// POST /api/auth/login
// Body: { "username": "admin", "password": "xxx" }
@Data
public class LoginRequest {
    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;
}