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
import com.uniflow.repository.QueueTicketRepository;
import com.uniflow.repository.ServiceRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.AppointmentService;
import com.uniflow.service.NotificationService;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final OfficeRepository officeRepository;
    private final ServiceRepository serviceRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  OfficeRepository officeRepository,
                                  ServiceRepository serviceRepository,
                                  QueueTicketRepository queueTicketRepository,
                                  NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.officeRepository = officeRepository;
        this.serviceRepository = serviceRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(@NonNull AppointmentRequest request, @NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long officeId = Objects.requireNonNull(request.getOfficeId(), "Office ID is required");
        Long serviceId = Objects.requireNonNull(request.getServiceId(), "Service ID is required");

        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        OfficeService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        LocalDateTime appointmentTime = request.getAppointmentTime();

        if (appointmentTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book appointment in the past");
        }

        boolean hasActiveAppointment = appointmentRepository.findByStudentId(userId).stream()
                .anyMatch(existing -> existing.getOffice().getId().equals(office.getId())
                        && existing.getService().getId().equals(service.getId())
                        && !existing.getStatus().equals("COMPLETED")
                        && !existing.getStatus().equals("CANCELLED"));
        if (hasActiveAppointment) {
            throw new BadRequestException("You already have an active appointment for this office and service. Please complete or cancel it first.");
        }

        if (hasQueueNearTurn(userId)) {
            throw new BadRequestException("Your queue turn is near. Please complete it before booking an appointment.");
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

        notificationService.createNotification(
            userId,
            "Appointment request received",
            "Your appointment request " + savedAppointment.getReferenceNumber() + " for "
                + service.getName() + " at " + office.getName() + " has been submitted.",
            "appointment"
        );

        return mapToAppointmentResponse(savedAppointment);
    }

    @Override
    @Transactional
    public AppointmentResponse confirmAppointment(@NonNull Long appointmentId) {
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
    @Transactional
    public AppointmentResponse completeAppointment(@NonNull Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appointment.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Cannot complete a cancelled appointment");
        }
        appointment.setStatus("COMPLETED");
        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointmentByStaff(@NonNull Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appointment.getStatus().equals("COMPLETED") || appointment.getStatus().equals("CANCELLED")) {
            throw new BadRequestException("Appointment cannot be cancelled");
        }
        appointment.setStatus("CANCELLED");
        return mapToAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentResponse getAppointment(@NonNull Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return mapToAppointmentResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getUserAppointments(@NonNull Long userId) {
        List<Appointment> appointments = appointmentRepository.findByStudentId(userId);
        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getOfficeAppointments(@NonNull Long officeId) {
        List<Appointment> appointments = appointmentRepository.findByOfficeId(officeId);
        return appointments.stream()
                .map(this::mapToAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointment(@NonNull Long appointmentId, @NonNull Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to cancel this appointment");
        }

        if (!appointment.getStatus().equals("PENDING")) {
            throw new BadRequestException("Only pending appointments can be cancelled by the student");
        }

        appointment.setStatus("CANCELLED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToAppointmentResponse(updatedAppointment);
    }

    @Override
    @Transactional
    public AppointmentResponse rescheduleAppointment(@NonNull Long appointmentId, @NonNull LocalDateTime newTime, @NonNull Long userId) {
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
    public List<LocalDateTime> getAvailableSlots(@NonNull Long officeId, @Nullable LocalDate date) {
        List<LocalDateTime> availableSlots = new ArrayList<>();

        try {
            Office office = officeRepository.findById(officeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

            if (date == null) {
                return availableSlots;
            }

            LocalDateTime startTime = date.atTime(9, 0);
            LocalDateTime endTime = date.atTime(17, 0);
            List<LocalDateTime> bookedTimes = appointmentRepository.findByOfficeId(office.getId())
                    .stream()
                    .filter(appointment -> appointment != null && appointment.getStatus() != null && !"CANCELLED".equalsIgnoreCase(appointment.getStatus()))
                    .map(appointment -> appointment != null ? appointment.getAppointmentTime() : null)
                    .filter(slot -> slot != null && slot.toLocalDate().equals(date))
                    .collect(Collectors.toList());

            while (startTime.isBefore(endTime)) {
                LocalDateTime slot = startTime;
                boolean isBooked = bookedTimes.stream().anyMatch(booked -> booked.equals(slot));
                if (!isBooked) {
                    availableSlots.add(slot);
                }
                startTime = startTime.plusMinutes(30);
            }

        } catch (Exception e) {
            System.err.println("Error in getAvailableSlots: " + e.getMessage());
            e.printStackTrace();
        }

        return availableSlots;
    }

    private boolean hasQueueNearTurn(Long userId) {
        return queueTicketRepository.findByStudentId(userId).stream()
                .anyMatch(ticket -> ticket.getStatus().equals("CALLED")
                        || (ticket.getStatus().equals("WAITING")
                        && ticket.getPosition() != null
                        && ticket.getPosition() <= 2));
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
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }
}