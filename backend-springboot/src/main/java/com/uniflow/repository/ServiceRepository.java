package com.uniflow.repository;

import com.uniflow.model.OfficeService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<OfficeService, Long> {
    List<OfficeService> findByOfficeId(Long officeId);
    List<OfficeService> findByOfficeIdAndActiveTrue(Long officeId);
}