package com.uniflow.dto.response;

import java.time.LocalDateTime;

public class DocumentResponse {
    private Long id;
    private String documentType;
    private String status;
    private String trackingNumber;
    private String officeName;
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public DocumentResponse() {}

    // Parameterized constructor
    public DocumentResponse(Long id, String documentType, String status, String trackingNumber,
                            String officeName, String comments, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.documentType = documentType;
        this.status = status;
        this.trackingNumber = trackingNumber;
        this.officeName = officeName;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}