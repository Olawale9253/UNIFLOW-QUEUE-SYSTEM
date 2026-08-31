package com.uniflow.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import com.uniflow.dto.request.AppointmentRequest;
import com.uniflow.dto.response.AppointmentResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentRequest request, Long userId);
    AppointmentResponse getAppointment(Long appointmentId);
    List<AppointmentResponse> getUserAppointments(Long userId);
    List<AppointmentResponse> getOfficeAppointments(Long officeId);
    AppointmentResponse cancelAppointment(Long appointmentId, Long userId);
    AppointmentResponse rescheduleAppointment(Long appointmentId, LocalDateTime newTime, Long userId);
    List<LocalDateTime> getAvailableSlots(Long officeId, LocalDateTime date);
}