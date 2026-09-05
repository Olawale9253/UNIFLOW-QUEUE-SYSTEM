package com.uniflow.controller;

import com.uniflow.dto.request.AppointmentRequest;
import com.uniflow.dto.response.AppointmentResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.ActivityLogService;
import com.uniflow.service.AppointmentService;
import com.uniflow.service.SystemSettingsService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ActivityLogService activityLogService;
    private final SystemSettingsService systemSettingsService;

    public AppointmentController(AppointmentService appointmentService,
                                 ActivityLogService activityLogService,
                                 SystemSettingsService systemSettingsService) {
        this.appointmentService = appointmentService;
        this.activityLogService = activityLogService;
        this.systemSettingsService = systemSettingsService;
    }

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        systemSettingsService.requireAvailable("appointments");
        AppointmentResponse response = appointmentService.bookAppointment(request, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Booked an appointment with " + response.getOfficeName(),
                    "appointment"
            );
            System.out.println("✅ Activity logged: Appointment booked by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AppointmentResponse> responses = appointmentService.getUserAppointments(userDetails.getId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable Long appointmentId) {
        AppointmentResponse response = appointmentService.getAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/office/{officeId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getOfficeAppointments(@PathVariable Long officeId) {
        List<AppointmentResponse> responses = appointmentService.getOfficeAppointments(officeId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{appointmentId}/confirm")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> confirmAppointment(@PathVariable Long appointmentId) {
        AppointmentResponse response = appointmentService.confirmAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> completeAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.completeAppointment(appointmentId));
    }

    @DeleteMapping("/{appointmentId}/staff-cancel")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> cancelAppointmentByStaff(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.cancelAppointmentByStaff(appointmentId));
    }

    @DeleteMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentResponse response = appointmentService.cancelAppointment(appointmentId, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Cancelled appointment: " + response.getReferenceNumber(),
                    "appointment"
            );
            System.out.println("✅ Activity logged: Appointment cancelled by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newTime,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentResponse response = appointmentService.rescheduleAppointment(appointmentId, newTime, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Rescheduled appointment: " + response.getReferenceNumber(),
                    "appointment"
            );
            System.out.println("✅ Activity logged: Appointment rescheduled by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/available-slots/{officeId}")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @PathVariable Long officeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalDateTime> slots = appointmentService.getAvailableSlots(officeId, date);
        return ResponseEntity.ok(slots);
    }
}