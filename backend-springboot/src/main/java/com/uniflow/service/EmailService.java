package com.uniflow.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("UniFlow - Password Reset Request");
            message.setText(
                    "Hello,\n\n" +
                            "You requested to reset your password for UniFlow.\n\n" +
                            "Click the link below to reset your password:\n" +
                            resetLink + "\n\n" +
                            "This link will expire in 24 hours.\n\n" +
                            "If you didn't request this, please ignore this email.\n\n" +
                            "Regards,\n" +
                            "UniFlow Team"
            );

            mailSender.send(message);
            System.out.println("✅ Password reset email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to UniFlow!");
            message.setText(
                    "Hello " + name + ",\n\n" +
                            "Welcome to UniFlow - Digital Queue Management System!\n\n" +
                            "You can now book appointments, join queues, and request documents online.\n\n" +
                            "Login here: http://localhost:3000/login\n\n" +
                            "Regards,\n" +
                            "UniFlow Team"
            );

            mailSender.send(message);
            System.out.println("✅ Welcome email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to " + to + ": " + e.getMessage());
        }
    }
}