package com.uniflow.service;

import com.uniflow.dto.request.AppointmentRequest;
import com.uniflow.dto.response.AppointmentResponse;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(@NonNull AppointmentRequest request, @NonNull Long userId);
    AppointmentResponse getAppointment(@NonNull Long appointmentId);
    AppointmentResponse confirmAppointment(@NonNull Long appointmentId);
    AppointmentResponse completeAppointment(@NonNull Long appointmentId);
    AppointmentResponse cancelAppointmentByStaff(@NonNull Long appointmentId);
    List<AppointmentResponse> getUserAppointments(@NonNull Long userId);
    List<AppointmentResponse> getAllAppointments();
    List<AppointmentResponse> getOfficeAppointments(@NonNull Long officeId);
    AppointmentResponse cancelAppointment(@NonNull Long appointmentId, @NonNull Long userId);
    AppointmentResponse rescheduleAppointment(@NonNull Long appointmentId, @NonNull LocalDateTime newTime, @NonNull Long userId);
    List<LocalDateTime> getAvailableSlots(@NonNull Long officeId, @Nullable LocalDate date);
}