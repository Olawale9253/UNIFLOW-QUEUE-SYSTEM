package com.uniflow.controller;

import com.uniflow.dto.request.DocumentRequestDTO;
import com.uniflow.dto.response.DocumentResponse;
import com.uniflow.security.CustomUserDetails;
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

    // Explicit constructor
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/request")
    public ResponseEntity<DocumentResponse> requestDocument(
            @Valid @RequestBody DocumentRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        DocumentResponse response = documentService.requestDocument(request, userDetails.getId());
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
        return ResponseEntity.ok(response);
    }
}