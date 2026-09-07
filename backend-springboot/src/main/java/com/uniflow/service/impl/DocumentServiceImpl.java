package com.uniflow.service.impl;

import com.uniflow.dto.request.DocumentRequestDTO;
import com.uniflow.dto.response.DocumentResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.ResourceNotFoundException;
import com.uniflow.model.DocumentRequest;
import com.uniflow.model.Office;
import com.uniflow.model.User;
import com.uniflow.repository.DocumentRequestRepository;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.repository.QueueTicketRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.DocumentService;
import com.uniflow.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRequestRepository documentRequestRepository;
    private final UserRepository userRepository;
    private final OfficeRepository officeRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    public DocumentServiceImpl(DocumentRequestRepository documentRequestRepository,
                               UserRepository userRepository,
                               OfficeRepository officeRepository,
                               QueueTicketRepository queueTicketRepository,
                               NotificationService notificationService) {
        this.documentRequestRepository = documentRequestRepository;
        this.userRepository = userRepository;
        this.officeRepository = officeRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public DocumentResponse requestDocument(DocumentRequestDTO request, Long userId) {
        // Validate userId
        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (request.getOfficeId() == null) {
            throw new BadRequestException("Office ID cannot be null");
        }

        Office office = officeRepository.findById(request.getOfficeId())
                .orElseThrow(() -> new ResourceNotFoundException("Office not found with ID: " + request.getOfficeId()));

        if (request.getDocumentType() == null || request.getDocumentType().isEmpty()) {
            throw new BadRequestException("Document type cannot be empty");
        }

        boolean hasActiveDocument = documentRequestRepository.findByStudentId(userId).stream()
                .anyMatch(existing -> existing.getOffice().getId().equals(office.getId())
                        && existing.getDocumentType().equals(request.getDocumentType())
                        && isActiveDocumentStatus(existing.getStatus()));
        if (hasActiveDocument) {
            throw new BadRequestException("You already have an active request for this office and document type. Please wait until it is completed or rejected.");
        }

        if (hasQueueNearTurn(userId)) {
            throw new BadRequestException("Your queue turn is near. Please complete it before making another request.");
        }

        // Generate tracking number
        String trackingNumber = generateTrackingNumber();

        DocumentRequest documentRequest = new DocumentRequest();
        documentRequest.setStudent(user);
        documentRequest.setOffice(office);
        documentRequest.setDocumentType(request.getDocumentType());
        documentRequest.setStatus("SUBMITTED");
        documentRequest.setTrackingNumber(trackingNumber);
        documentRequest.setComments(request.getComments());

        // Log the request
        System.out.println("Saving document request:");
        System.out.println("  Student ID: " + user.getId());
        System.out.println("  Office ID: " + office.getId());
        System.out.println("  Document Type: " + request.getDocumentType());
        System.out.println("  Tracking Number: " + trackingNumber);

        DocumentRequest savedRequest = documentRequestRepository.save(documentRequest);
        notificationService.createNotification(
            user.getId(),
            "Document request submitted",
            "Your " + request.getDocumentType().replace('_', ' ') + " request was submitted successfully.",
            "document"
        );

        return mapToDocumentResponse(savedRequest);
    }

    @Override
    public DocumentResponse getDocumentRequest(Long requestId) {
        DocumentRequest request = documentRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Document request not found"));
        return mapToDocumentResponse(request);
    }

    @Override
    public List<DocumentResponse> getUserDocuments(Long userId) {
        List<DocumentRequest> requests = documentRequestRepository.findByStudentId(userId);
        return requests.stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentResponse> getOfficeDocuments(Long officeId) {
        return documentRequestRepository.findByOfficeId(officeId).stream()
                .map(this::mapToDocumentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DocumentResponse updateDocumentStatus(Long requestId, String status, String comments) {
        DocumentRequest request = documentRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Document request not found"));

        if (!isValidStatus(status)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        request.setStatus(status);
        if (comments != null && !comments.isEmpty()) {
            request.setComments(comments);
        }

        DocumentRequest updatedRequest = documentRequestRepository.save(request);
        notificationService.createNotification(
            request.getStudent().getId(),
            "Document request updated",
            "Your " + request.getDocumentType().replace('_', ' ') + " request is now " + status + ".",
            "document"
        );

        return mapToDocumentResponse(updatedRequest);
    }

    @Override
    public DocumentResponse getDocumentByTrackingNumber(String trackingNumber) {
        DocumentRequest request = documentRequestRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Document request not found with tracking number: " + trackingNumber));
        return mapToDocumentResponse(request);
    }

    private String generateTrackingNumber() {
        String timestamp = LocalDateTime.now().format(formatter);
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "DOC" + timestamp + random;
    }

    private boolean isValidStatus(String status) {
        return status.equals("SUBMITTED") ||
                status.equals("UNDER_REVIEW") ||
                status.equals("PROCESSING") ||
                status.equals("READY_FOR_COLLECTION") ||
                status.equals("COMPLETED") ||
                status.equals("REJECTED");
    }

    private boolean isActiveDocumentStatus(String status) {
        return !status.equals("COMPLETED") && !status.equals("REJECTED");
    }

    private boolean hasQueueNearTurn(Long userId) {
        return queueTicketRepository.findByStudentId(userId).stream()
                .anyMatch(ticket -> ticket.getStatus().equals("CALLED")
                        || (ticket.getStatus().equals("WAITING")
                        && ticket.getPosition() != null
                        && ticket.getPosition() <= 2));
    }

    private DocumentResponse mapToDocumentResponse(DocumentRequest request) {
        return new DocumentResponse(
                request.getId(),
                request.getDocumentType(),
                request.getStatus(),
                request.getTrackingNumber(),
                request.getOffice() != null ? request.getOffice().getName() : "N/A",
                request.getComments(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}