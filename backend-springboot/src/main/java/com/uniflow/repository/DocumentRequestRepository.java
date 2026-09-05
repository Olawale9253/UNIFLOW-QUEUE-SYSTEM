package com.uniflow.repository;

import com.uniflow.model.DocumentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Long> {
    List<DocumentRequest> findByStudentId(Long studentId);
    List<DocumentRequest> findByOfficeId(Long officeId);
    Optional<DocumentRequest> findByTrackingNumber(String trackingNumber);
}