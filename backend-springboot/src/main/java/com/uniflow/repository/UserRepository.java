package com.uniflow.repository;

import com.uniflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    long countByRole(String role);
    Optional<User> findByEmail(String email);
    Optional<User> findByMatriculationNumber(String matriculationNumber);
    Optional<User> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
    boolean existsByMatriculationNumber(String matriculationNumber);
}