package com.uniflow.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "UniFlow Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/email-status")
    public Map<String, Object> emailStatus() {
        boolean configured = mailUsername != null && !mailUsername.trim().isEmpty()
                && mailPassword != null && !mailPassword.trim().isEmpty();

        Map<String, Object> response = new HashMap<>();
        response.put("emailConfigured", configured);
        response.put("provider", "Gmail SMTP");
        response.put("status", configured ? "READY" : "MISSING_CREDENTIALS");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}