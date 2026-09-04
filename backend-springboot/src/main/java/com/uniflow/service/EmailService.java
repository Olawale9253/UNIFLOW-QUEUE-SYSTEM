package com.uniflow.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // No-reply email address
    private static final String NO_REPLY_EMAIL = "noreply@uniflow.com";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(NO_REPLY_EMAIL);
            message.setTo(to);
            message.setSubject("🔐 UniFlow - Password Reset Request");
            message.setText(
                    "Hello,\n\n" +
                            "You requested to reset your password for UniFlow.\n\n" +
                            "Click the link below to reset your password:\n" +
                            resetLink + "\n\n" +
                            "⚠️ This link will expire in 15 minutes.\n\n" +
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
            message.setFrom(NO_REPLY_EMAIL);
            message.setTo(to);
            message.setSubject("🎉 Welcome to UniFlow!");
            message.setText(
                    "Hello " + name + ",\n\n" +
                            "Welcome to UniFlow - Digital Queue Management System!\n\n" +
                            "You can now:\n" +
                            "✅ Book appointments with any office\n" +
                            "✅ Join virtual queues\n" +
                            "✅ Request and track documents\n" +
                            "✅ Receive notifications\n\n" +
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

    public void sendAppointmentConfirmation(String to, String name, String office, String dateTime, String reference) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(NO_REPLY_EMAIL);
            message.setTo(to);
            message.setSubject("📅 UniFlow - Appointment Confirmation");
            message.setText(
                    "Hello " + name + ",\n\n" +
                            "Your appointment has been confirmed!\n\n" +
                            "📋 Details:\n" +
                            "  Office: " + office + "\n" +
                            "  Date & Time: " + dateTime + "\n" +
                            "  Reference: " + reference + "\n\n" +
                            "Please arrive on time and bring your student ID.\n\n" +
                            "Regards,\n" +
                            "UniFlow Team"
            );

            mailSender.send(message);
            System.out.println("✅ Appointment confirmation email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send appointment email to " + to + ": " + e.getMessage());
        }
    }

    public void sendAppointmentReminder(String to, String name, String office, String dateTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(NO_REPLY_EMAIL);
            message.setTo(to);
            message.setSubject("⏰ UniFlow - Appointment Reminder");
            message.setText(
                    "Hello " + name + ",\n\n" +
                            "Reminder: You have an appointment tomorrow!\n\n" +
                            "📋 Details:\n" +
                            "  Office: " + office + "\n" +
                            "  Date & Time: " + dateTime + "\n\n" +
                            "Please arrive on time.\n\n" +
                            "Regards,\n" +
                            "UniFlow Team"
            );

            mailSender.send(message);
            System.out.println("✅ Appointment reminder email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send reminder email to " + to + ": " + e.getMessage());
        }
    }

    public void sendDocumentStatusUpdate(String to, String name, String documentType, String status, String trackingNumber) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(NO_REPLY_EMAIL);
            message.setTo(to);
            message.setSubject("📄 UniFlow - Document Status Update");
            message.setText(
                    "Hello " + name + ",\n\n" +
                            "Your document request status has been updated!\n\n" +
                            "📋 Details:\n" +
                            "  Document: " + documentType + "\n" +
                            "  Status: " + status + "\n" +
                            "  Tracking Number: " + trackingNumber + "\n\n" +
                            "Login to track your document: http://localhost:3000/documents\n\n" +
                            "Regards,\n" +
                            "UniFlow Team"
            );

            mailSender.send(message);
            System.out.println("✅ Document status update email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send document email to " + to + ": " + e.getMessage());
        }
    }
}