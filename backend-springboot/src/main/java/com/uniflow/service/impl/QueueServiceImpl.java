package com.uniflow.service.impl;

import com.uniflow.dto.request.QueueRequest;
import com.uniflow.dto.response.LiveQueueResponse;
import com.uniflow.dto.response.QueueResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.ResourceNotFoundException;
import com.uniflow.model.Office;
import com.uniflow.model.OfficeService;
import com.uniflow.model.QueueTicket;
import com.uniflow.model.User;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.repository.QueueTicketRepository;
import com.uniflow.repository.ServiceRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.QueueService;
import com.uniflow.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueServiceImpl implements QueueService {

    private final QueueTicketRepository queueTicketRepository;
    private final OfficeRepository officeRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public QueueServiceImpl(QueueTicketRepository queueTicketRepository,
                            OfficeRepository officeRepository,
                            ServiceRepository serviceRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.queueTicketRepository = queueTicketRepository;
        this.officeRepository = officeRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public QueueResponse joinQueue(QueueRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Office office = officeRepository.findById(request.getOfficeId())
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        OfficeService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        // Check if user already has an active ticket for THIS SAME office AND service
        List<QueueTicket> activeTickets = queueTicketRepository.findByStudentId(userId)
                .stream()
                .filter(ticket -> ticket.getStatus().equals("WAITING") || ticket.getStatus().equals("CALLED"))
                .filter(ticket -> ticket.getOffice().getId().equals(office.getId()))
                .filter(ticket -> ticket.getService().getId().equals(service.getId()))
                .collect(Collectors.toList());

        if (!activeTickets.isEmpty()) {
            throw new BadRequestException("You already have an active queue ticket for this office and service");
        }

        // Check if user already has an active ticket for THIS SAME office (different service)
        List<QueueTicket> sameOfficeTickets = queueTicketRepository.findByStudentId(userId)
                .stream()
                .filter(ticket -> ticket.getStatus().equals("WAITING") || ticket.getStatus().equals("CALLED"))
                .filter(ticket -> ticket.getOffice().getId().equals(office.getId()))
                .collect(Collectors.toList());

        if (!sameOfficeTickets.isEmpty()) {
            String existingService = sameOfficeTickets.get(0).getService().getName();
            throw new BadRequestException("You already have a queue ticket for " + office.getName() +
                    " (Service: " + existingService + "). Please complete or cancel it first.");
        }

        // Get current position for this office
        int position = getWaitingTickets(office.getId()).size() + 1;

        // Generate ticket number
        String ticketNumber = generateTicketNumber(office.getId());

        QueueTicket ticket = new QueueTicket();
        ticket.setStudent(user);
        ticket.setOffice(office);
        ticket.setService(service);
        ticket.setTicketNumber(ticketNumber);
        ticket.setPosition(position);
        ticket.setStatus("WAITING");
        ticket.setEstimatedWaitTime(position * service.getDurationMinutes());

        QueueTicket savedTicket = queueTicketRepository.save(ticket);
        reindexQueue(office.getId());

        notificationService.createNotification(
            userId,
            "Queue request received",
            "Your queue ticket " + savedTicket.getTicketNumber() + " for " + service.getName()
                + " at " + office.getName() + " has been created.",
            "queue"
        );

        return mapToQueueResponse(queueTicketRepository.findById(savedTicket.getId()).orElse(savedTicket));
    }

    @Override
    public QueueResponse getQueueStatus(Long ticketId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));
        return mapToQueueResponse(ticket);
    }

    @Override
    public List<QueueResponse> getUserQueues(Long userId) {
        List<QueueTicket> tickets = queueTicketRepository.findByStudentId(userId);
        return tickets.stream()
                .map(this::mapToQueueResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QueueResponse> getOfficeTickets(Long officeId) {
        return queueTicketRepository.findByOfficeId(officeId).stream()
                .map(this::mapToQueueResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LiveQueueResponse getLiveQueue(Long officeId) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        List<QueueTicket> waitingTickets = getWaitingTickets(officeId);
        long waitingCount = queueTicketRepository.countByOfficeIdAndStatus(officeId, "WAITING");

        List<QueueTicket> calledTickets = queueTicketRepository.findByOfficeIdAndStatusOrderByPositionAsc(officeId, "CALLED");
        QueueTicket servingTicket = calledTickets.isEmpty() ? null : calledTickets.get(0);

        double avgWaitTime = waitingTickets.stream()
                .mapToInt(QueueTicket::getEstimatedWaitTime)
                .average()
                .orElse(0.0);

        List<QueueResponse> waitingResponses = waitingTickets.stream()
                .map(this::mapToQueueResponse)
                .collect(Collectors.toList());

        return new LiveQueueResponse(
                officeId,
                office.getName(),
                servingTicket != null ? servingTicket.getTicketNumber() : "None",
                servingTicket != null ? mapToQueueResponse(servingTicket) : null,
                waitingCount,
                (int) avgWaitTime,
                waitingResponses
        );
    }

    @Override
    @Transactional
    public QueueResponse callNextTicket(Long officeId, Long staffId) {
        List<QueueTicket> waitingTickets = getWaitingTickets(officeId);

        if (waitingTickets.isEmpty()) {
            throw new BadRequestException("No waiting tickets in the queue");
        }

        QueueTicket ticket = waitingTickets.get(0);
        ticket.setStatus("CALLED");
        ticket.setCalledAt(LocalDateTime.now());

        QueueTicket updatedTicket = queueTicketRepository.save(ticket);
        reindexQueue(officeId);
        notificationService.createNotification(
            ticket.getStudent().getId(),
            "Queue ticket called",
            "Your ticket " + ticket.getTicketNumber() + " is now being served at " + ticket.getOffice().getName() + ".",
            "queue"
        );

        return mapToQueueResponse(updatedTicket);
    }

    @Override
    @Transactional
    public QueueResponse completeTicket(Long ticketId, Long staffId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        if (!ticket.getStatus().equals("CALLED")) {
            throw new BadRequestException("Ticket must be called first before completing");
        }

        ticket.setStatus("COMPLETED");
        ticket.setCompletedAt(LocalDateTime.now());

        QueueTicket updatedTicket = queueTicketRepository.save(ticket);
        reindexQueue(ticket.getOffice().getId());
        notificationService.createNotification(
            ticket.getStudent().getId(),
            "Queue ticket completed",
            "Your ticket " + ticket.getTicketNumber() + " at " + ticket.getOffice().getName() + " has been completed.",
            "queue"
        );

        return mapToQueueResponse(updatedTicket);
    }

    @Override
    @Transactional
    public QueueResponse skipTicket(Long ticketId, Long staffId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        if (!ticket.getStatus().equals("WAITING") && !ticket.getStatus().equals("CALLED")) {
            throw new BadRequestException("Ticket cannot be skipped");
        }

        ticket.setStatus("SKIPPED");

        QueueTicket updatedTicket = queueTicketRepository.save(ticket);
        reindexQueue(ticket.getOffice().getId());
        notificationService.createNotification(
            ticket.getStudent().getId(),
            "Queue ticket skipped",
            "Your ticket " + ticket.getTicketNumber() + " at " + ticket.getOffice().getName() + " was skipped.",
            "queue"
        );

        return mapToQueueResponse(updatedTicket);
    }

    @Override
    @Transactional
    public QueueResponse rescheduleTicket(Long ticketId, Long userId) {
        QueueTicket ticket = queueTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        if (!ticket.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to reschedule this ticket");
        }
        if (!ticket.getStatus().equals("WAITING")) {
            throw new BadRequestException("Only waiting tickets can be rescheduled");
        }

        Long officeId = ticket.getOffice().getId();
        ticket.setPosition(getWaitingTickets(officeId).size() + 1);
        QueueTicket updatedTicket = queueTicketRepository.save(ticket);
        reindexQueue(officeId);
        notificationService.createNotification(
                userId,
                "Queue ticket rescheduled",
                "Your ticket " + ticket.getTicketNumber() + " was moved to the end of the queue.",
                "queue"
        );
        return mapToQueueResponse(updatedTicket);
    }

    @Override
    public List<LiveQueueResponse> getAllLiveQueues() {
        List<Office> offices = officeRepository.findByActiveTrue();
        return offices.stream()
                .map(office -> getLiveQueue(office.getId()))
                .collect(Collectors.toList());
    }

    private String generateTicketNumber(Long officeId) {
        String timestamp = LocalDateTime.now().format(formatter);
        String officeCode = String.format("%03d", officeId);
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return "Q" + officeCode + timestamp.substring(6) + random;
    }

    private List<QueueTicket> getWaitingTickets(Long officeId) {
        return queueTicketRepository.findByOfficeIdAndStatusOrderByPositionAsc(officeId, "WAITING");
    }

    private void reindexQueue(Long officeId) {
        List<QueueTicket> waitingTickets = getWaitingTickets(officeId);
        for (int index = 0; index < waitingTickets.size(); index++) {
            QueueTicket ticket = waitingTickets.get(index);
            int newPosition = index + 1;
            if (!Integer.valueOf(newPosition).equals(ticket.getPosition())) {
                ticket.setPosition(newPosition);
                ticket.setEstimatedWaitTime(newPosition * ticket.getService().getDurationMinutes());
                queueTicketRepository.save(ticket);
                notificationService.createNotification(
                        ticket.getStudent().getId(),
                        "Queue position updated",
                        "Your ticket " + ticket.getTicketNumber() + " is now position " + newPosition + ".",
                        "queue"
                );
            }
        }
    }

    private QueueResponse mapToQueueResponse(QueueTicket ticket) {
        return new QueueResponse(
                ticket.getId(),
                ticket.getTicketNumber(),
                ticket.getPosition(),
                ticket.getStatus(),
                ticket.getEstimatedWaitTime(),
                ticket.getOffice().getName(),
                ticket.getService() != null ? ticket.getService().getName() : "N/A",
                ticket.getCalledAt() != null ? ticket.getCalledAt().toString() : null,
                ticket.getCompletedAt() != null ? ticket.getCompletedAt().toString() : null
        );
    }
}