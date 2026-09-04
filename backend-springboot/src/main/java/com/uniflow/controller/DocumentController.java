package com.uniflow.controller;

import com.uniflow.dto.request.DocumentRequestDTO;
import com.uniflow.dto.response.DocumentResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.ActivityLogService;
import com.uniflow.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final ActivityLogService activityLogService;

    public DocumentController(DocumentService documentService, ActivityLogService activityLogService) {
        this.documentService = documentService;
        this.activityLogService = activityLogService;
    }

    @PostMapping("/request")
    public ResponseEntity<DocumentResponse> requestDocument(
            @Valid @RequestBody DocumentRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        DocumentResponse response = documentService.requestDocument(request, userDetails.getId());

        // Log activity
        try {
            activityLogService.logActivity(
                    userDetails.getFullName(),
                    "Requested a " + request.getDocumentType(),
                    "document"
            );
            System.out.println("✅ Activity logged: Document requested by " + userDetails.getFullName());
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<DocumentResponse>> getMyDocuments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<DocumentResponse> responses = documentService.getUserDocuments(userDetails.getId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<DocumentResponse> getDocumentRequest(@PathVariable Long requestId) {
        DocumentResponse response = documentService.getDocumentRequest(requestId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<DocumentResponse> trackDocument(@PathVariable String trackingNumber) {
        DocumentResponse response = documentService.getDocumentByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DocumentResponse> updateDocumentStatus(
            @PathVariable Long requestId,
            @RequestParam String status,
            @RequestParam(required = false) String comments) {
        DocumentResponse response = documentService.updateDocumentStatus(requestId, status, comments);

        // Log activity
        try {
            activityLogService.logActivity(
                    "Admin/Staff",
                    "Updated document status to " + status + " for " + response.getTrackingNumber(),
                    "document"
            );
            System.out.println("✅ Activity logged: Document status updated");
        } catch (Exception e) {
            System.err.println("❌ Failed to log activity: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}