package com.uniflow.repository;

import com.uniflow.model.Office;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficeRepository extends JpaRepository<Office, Long> {
    Optional<Office> findByName(String name);
    List<Office> findByActiveTrue();
}