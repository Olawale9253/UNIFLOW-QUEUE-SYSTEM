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

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    public QueueServiceImpl(QueueTicketRepository queueTicketRepository,
                            OfficeRepository officeRepository,
                            ServiceRepository serviceRepository,
                            UserRepository userRepository) {
        this.queueTicketRepository = queueTicketRepository;
        this.officeRepository = officeRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
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

        List<QueueTicket> activeTickets = queueTicketRepository.findByStudentId(userId)
                .stream()
                .filter(ticket -> ticket.getStatus().equals("WAITING") || ticket.getStatus().equals("CALLED"))
                .collect(Collectors.toList());

        if (!activeTickets.isEmpty()) {
            throw new BadRequestException("You already have an active queue ticket");
        }

        long count = queueTicketRepository.countByOfficeIdAndStatus(office.getId(), "WAITING");
        int position = (int) count + 1;

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

        return mapToQueueResponse(savedTicket);
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
    public LiveQueueResponse getLiveQueue(Long officeId) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        List<QueueTicket> waitingTickets = queueTicketRepository.findByOfficeIdAndStatus(officeId, "WAITING");
        long waitingCount = queueTicketRepository.countByOfficeIdAndStatus(officeId, "WAITING");

        List<QueueTicket> calledTickets = queueTicketRepository.findByOfficeIdAndStatus(officeId, "CALLED");
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
                waitingCount,
                (int) avgWaitTime,
                waitingResponses
        );
    }

    @Override
    @Transactional
    public QueueResponse callNextTicket(Long officeId, Long staffId) {
        List<QueueTicket> waitingTickets = queueTicketRepository.findByOfficeIdAndStatus(officeId, "WAITING");

        if (waitingTickets.isEmpty()) {
            throw new BadRequestException("No waiting tickets in the queue");
        }

        QueueTicket ticket = waitingTickets.get(0);
        ticket.setStatus("CALLED");
        ticket.setCalledAt(LocalDateTime.now());

        QueueTicket updatedTicket = queueTicketRepository.save(ticket);

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