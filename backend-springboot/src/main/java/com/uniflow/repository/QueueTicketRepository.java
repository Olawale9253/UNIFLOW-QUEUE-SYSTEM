package com.uniflow.repository;

import com.uniflow.model.QueueTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueueTicketRepository extends JpaRepository<QueueTicket, Long> {
    List<QueueTicket> findByOfficeIdAndStatusOrderByPositionAsc(Long officeId, String status);
    List<QueueTicket> findByStudentId(Long studentId);
    List<QueueTicket> findByOfficeId(Long officeId);
    QueueTicket findTopByOfficeIdOrderByPositionDesc(Long officeId);
    long countByOfficeIdAndStatus(Long officeId, String status);
}