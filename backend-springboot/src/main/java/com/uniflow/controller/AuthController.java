package com.uniflow.controller;

import com.uniflow.dto.request.LoginRequest;
import com.uniflow.dto.request.RegisterRequest;
import com.uniflow.dto.response.AuthResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.service.ActivityLogService;
import com.uniflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final ActivityLogService activityLogService;

    public AuthController(AuthService authService, ActivityLogService activityLogService) {
        this.authService = authService;
        this.activityLogService = activityLogService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        // Log activity
        try {
            activityLogService.logActivity(
                    request.getFullName(),
                    "Registered as a new user",
                    "user"
            );
            System.out.println("✅ Activity logged: New user registered: " + request.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        // Log activity
        try {
            activityLogService.logActivity(
                    response.getFullName(),
                    "Logged in to the system",
                    "user"
            );
            System.out.println("✅ Activity logged: User logged in: " + response.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(Map.of("message", "Password reset link sent to your email"));
    }

    @GetMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam String token) {
        boolean isValid = authService.verifyResetToken(token);
        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            throw new BadRequestException("Invalid or expired reset token");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}