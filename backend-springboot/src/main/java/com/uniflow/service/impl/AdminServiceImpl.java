package com.uniflow.service.impl;

import com.uniflow.dto.response.DashboardStatsResponse;
import com.uniflow.repository.AppointmentRepository;
import com.uniflow.repository.DocumentRequestRepository;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.repository.QueueTicketRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.AdminService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueTicketRepository queueTicketRepository;
    private final DocumentRequestRepository documentRequestRepository;
    private final OfficeRepository officeRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            AppointmentRepository appointmentRepository,
                            QueueTicketRepository queueTicketRepository,
                            DocumentRequestRepository documentRequestRepository,
                            OfficeRepository officeRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueTicketRepository = queueTicketRepository;
        this.documentRequestRepository = documentRequestRepository;
        this.officeRepository = officeRepository;
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        long totalStudents = userRepository.countByRole("STUDENT");
        long totalAppointments = appointmentRepository.count();
        long totalQueueTickets = queueTicketRepository.count();
        long totalDocumentRequests = documentRequestRepository.count();
        long todayAppointments = appointmentRepository.findByAppointmentTimeBetween(startOfDay, endOfDay).size();
        long pendingAppointments = appointmentRepository.countByStatus("PENDING");
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long totalOffices = officeRepository.count();
        long totalStaff = userRepository.countByRole("STAFF");

        DashboardStatsResponse response = new DashboardStatsResponse();
        response.setTotalStudents(totalStudents);
        response.setTotalAppointments(totalAppointments);
        response.setTotalQueueTickets(totalQueueTickets);
        response.setTotalDocumentRequests(totalDocumentRequests);
        response.setTodayAppointments(todayAppointments);
        response.setPendingAppointments(pendingAppointments);
        response.setCompletedAppointments(completedAppointments);
        response.setTotalOffices(totalOffices);
        response.setTotalServices(0L);
        response.setTotalStaff(totalStaff);

        return response;
    }
}