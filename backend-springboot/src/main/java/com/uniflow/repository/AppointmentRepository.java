package com.uniflow.repository;

import com.uniflow.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentId(Long studentId);
    List<Appointment> findByOfficeId(Long officeId);
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);
    boolean existsByOfficeIdAndAppointmentTime(Long officeId, LocalDateTime appointmentTime);
}