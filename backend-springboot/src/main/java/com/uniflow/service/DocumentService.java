package com.uniflow.service;

import com.uniflow.dto.request.DocumentRequestDTO;
import com.uniflow.dto.response.DocumentResponse;

import java.util.List;

public interface DocumentService {
    DocumentResponse requestDocument(DocumentRequestDTO request, Long userId);
    DocumentResponse getDocumentRequest(Long requestId);
    List<DocumentResponse> getUserDocuments(Long userId);
    DocumentResponse updateDocumentStatus(Long requestId, String status, String comments);
    DocumentResponse getDocumentByTrackingNumber(String trackingNumber);
}