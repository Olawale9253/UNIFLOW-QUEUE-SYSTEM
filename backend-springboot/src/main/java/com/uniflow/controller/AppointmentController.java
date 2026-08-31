package com.uniflow.controller;

import com.uniflow.dto.request.AppointmentRequest;
import com.uniflow.dto.response.AppointmentResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentResponse response = appointmentService.bookAppointment(request, userDetails.getId());
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

    @DeleteMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AppointmentResponse response = appointmentService.cancelAppointment(appointmentId, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestParam String newTime,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime parsedTime = LocalDateTime.parse(newTime, formatter);
        AppointmentResponse response = appointmentService.rescheduleAppointment(appointmentId, parsedTime, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available-slots/{officeId}")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long officeId,
            @RequestParam String date) {
        try {
            System.out.println("=== GET /available-slots/" + officeId + "?date=" + date + " ===");

            // Parse the date string to LocalDateTime (YYYY-MM-DD)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
            System.out.println("Parsed date: " + dateTime);

            List<LocalDateTime> slots = appointmentService.getAvailableSlots(officeId, dateTime);

            System.out.println("Returning " + slots.size() + " slots");

            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            System.err.println("Error in getAvailableSlots endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}