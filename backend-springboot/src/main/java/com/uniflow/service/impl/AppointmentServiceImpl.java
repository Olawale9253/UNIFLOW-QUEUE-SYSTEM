package com.uniflow.service.impl;

import com.uniflow.dto.request.AppointmentRequest;
import com.uniflow.dto.response.AppointmentResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.ResourceNotFoundException;
import com.uniflow.model.Appointment;
import com.uniflow.model.Office;
import com.uniflow.model.OfficeService;
import com.uniflow.model.User;
import com.uniflow.repository.AppointmentRepository;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.repository.ServiceRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.AppointmentService;
import com.uniflow.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final OfficeRepository officeRepository;
    private final ServiceRepository serviceRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  OfficeRepository officeRepository,
                                  ServiceRepository serviceRepository,
                                  NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.officeRepository = officeRepository;
        this.serviceRepository = serviceRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Office office = officeRepository.findById(request.getOfficeId())
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        OfficeService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        LocalDateTime appointmentTime = request.getAppointmentTime();

        if (appointmentTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book appointment in the past");
        }

        if (appointmentRepository.existsByOfficeIdAndAppointmentTime(office.getId(), appointmentTime)) {
            throw new BadRequestException("Appointment slot is already booked");
        }

        if (!isWithinWorkingHours(office, appointmentTime)) {
            throw new BadRequestException("Appointment time is outside working hours. Please book between 9:00 AM and 5:00 PM");
        }

        String referenceNumber = generateReferenceNumber();

        Appointment appointment = new Appointment();
        appointment.setStudent(user);
        appointment.setOffice(office);
        appointment.setService(service);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("PENDING");
        appointment.setReferenceNumber(referenceNumber);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToAppointmentResponse(savedAppointment);
    }

    @Override
    @Transactional
    public AppointmentResponse confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Cannot confirm a cancelled appointment");
        }

        appointment.setStatus("CONFIRMED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        notificationService.createNotification(
            appointment.getStudent().getId(),
            "Appointment confirmed",
            "Your appointment " + appointment.getReferenceNumber() + " at " + appointment.getOffice().getName() + " has been confirmed.",
            "appointment"
        );
        return mapToAppointmentResponse(updatedAppointment);
    }

    @Override
    public AppointmentResponse getAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return mapToAppointmentResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getUserAppointments(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByStudentId(userId);
        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getOfficeAppointments(Long officeId) {
        List<Appointment> appointments = appointmentRepository.findByOfficeId(officeId);
        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to cancel this appointment");
        }

        if (appointment.getStatus().equals("COMPLETED") || appointment.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Appointment cannot be cancelled");
        }

        appointment.setStatus("CANCELLED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToAppointmentResponse(updatedAppointment);
    }

    @Override
    @Transactional
    public AppointmentResponse rescheduleAppointment(Long appointmentId, LocalDateTime newTime, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to reschedule this appointment");
        }

        if (appointment.getStatus().equals("COMPLETED") || appointment.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Appointment cannot be rescheduled");
        }

        if (newTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot reschedule to a past time");
        }

        if (appointmentRepository.existsByOfficeIdAndAppointmentTime(appointment.getOffice().getId(), newTime)) {
            throw new BadRequestException("New appointment slot is already booked");
        }

        appointment.setAppointmentTime(newTime);
        appointment.setStatus("RESCHEDULED");

        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToAppointmentResponse(updatedAppointment);
    }

    @Override
    public List<LocalDateTime> getAvailableSlots(Long officeId, LocalDateTime date) {
        List<LocalDateTime> availableSlots = new ArrayList<>();

        try {
            System.out.println("=== getAvailableSlots called ===");
            System.out.println("Office ID: " + officeId);
            System.out.println("Date: " + date);

            // Generate slots from 9 AM to 5 PM with 30-minute intervals
            LocalDateTime startTime = date.with(LocalTime.of(9, 0));
            LocalDateTime endTime = date.with(LocalTime.of(17, 0));

            System.out.println("Generating slots from " + startTime + " to " + endTime);

            while (startTime.isBefore(endTime)) {
                availableSlots.add(startTime);
                startTime = startTime.plusMinutes(30);
            }

            System.out.println("Generated " + availableSlots.size() + " slots");

        } catch (Exception e) {
            System.err.println("Error in getAvailableSlots: " + e.getMessage());
            e.printStackTrace();
        }

        return availableSlots;
    }

    private boolean isWithinWorkingHours(Office office, LocalDateTime appointmentTime) {
        int hour = appointmentTime.getHour();
        return hour >= 9 && hour < 17;
    }

    private String generateReferenceNumber() {
        String timestamp = LocalDateTime.now().format(formatter);
        String random = String.format("%04d", (int) (Math.random() * 10000));
        String ref = "APP" + timestamp + random;
        System.out.println("Generated reference number: " + ref);
        return ref;
    }

    private AppointmentResponse mapToAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getOffice().getName(),
                appointment.getService() != null ? appointment.getService().getName() : "N/A",
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getReferenceNumber(),
                appointment.getCreatedAt()
        );
    }
}