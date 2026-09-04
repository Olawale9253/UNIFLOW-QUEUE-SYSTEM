package com.uniflow.controller;

import com.uniflow.dto.request.QueueRequest;
import com.uniflow.dto.response.LiveQueueResponse;
import com.uniflow.dto.response.QueueResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.ActivityLogService;
import com.uniflow.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/queues")
public class QueueController {

    private final QueueService queueService;
    private final ActivityLogService activityLogService;

    public QueueController(QueueService queueService, ActivityLogService activityLogService) {
        this.queueService = queueService;
        this.activityLogService = activityLogService;
    }

    @PostMapping("/join")
    public ResponseEntity<QueueResponse> joinQueue(
            @Valid @RequestBody QueueRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        QueueResponse response = queueService.joinQueue(request, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Joined a queue at " + response.getOfficeName(),
                    "queue"
            );
            System.out.println("✅ Activity logged: Queue joined by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<QueueResponse>> getMyQueues(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<QueueResponse> responses = queueService.getUserQueues(userDetails.getId());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{ticketId}/reschedule")
    public ResponseEntity<QueueResponse> rescheduleTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(queueService.rescheduleTicket(ticketId, userDetails.getId()));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<QueueResponse> getQueueStatus(@PathVariable Long ticketId) {
        QueueResponse response = queueService.getQueueStatus(ticketId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/live/{officeId}")
    public ResponseEntity<LiveQueueResponse> getLiveQueue(@PathVariable Long officeId) {
        LiveQueueResponse response = queueService.getLiveQueue(officeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/live/all")
    public ResponseEntity<List<LiveQueueResponse>> getAllLiveQueues() {
        List<LiveQueueResponse> responses = queueService.getAllLiveQueues();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/call/{officeId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<QueueResponse> callNextTicket(
            @PathVariable Long officeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        QueueResponse response = queueService.callNextTicket(officeId, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Called next ticket at " + response.getOfficeName(),
                    "queue"
            );
            System.out.println("✅ Activity logged: Ticket called by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/complete/{ticketId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<QueueResponse> completeTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        QueueResponse response = queueService.completeTicket(ticketId, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Completed ticket: " + response.getTicketNumber(),
                    "queue"
            );
            System.out.println("✅ Activity logged: Ticket completed by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/skip/{ticketId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<QueueResponse> skipTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        QueueResponse response = queueService.skipTicket(ticketId, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Skipped ticket: " + response.getTicketNumber(),
                    "queue"
            );
            System.out.println("✅ Activity logged: Ticket skipped by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}