package com.uniflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DocumentRequestDTO {
    @NotNull(message = "Office ID is required")
    private Long officeId;

    @NotBlank(message = "Document type is required")
    private String documentType;

    private String comments;

    // Getters and Setters
    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}