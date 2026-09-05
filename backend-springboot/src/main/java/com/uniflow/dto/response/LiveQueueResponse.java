package com.uniflow.dto.response;

import java.util.List;

public class LiveQueueResponse {
    private Long officeId;
    private String officeName;
    private String currentServing;
    private QueueResponse currentServingTicket;
    private Long waitingCount;
    private Integer averageWaitTime;
    private List<QueueResponse> waitingTickets;

    // Default constructor
    public LiveQueueResponse() {}

    // Parameterized constructor
    public LiveQueueResponse(Long officeId, String officeName, String currentServing,
                             QueueResponse currentServingTicket,
                             Long waitingCount, Integer averageWaitTime, List<QueueResponse> waitingTickets) {
        this.officeId = officeId;
        this.officeName = officeName;
        this.currentServing = currentServing;
        this.currentServingTicket = currentServingTicket;
        this.waitingCount = waitingCount;
        this.averageWaitTime = averageWaitTime;
        this.waitingTickets = waitingTickets;
    }

    // Getters and Setters
    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public String getCurrentServing() { return currentServing; }
    public void setCurrentServing(String currentServing) { this.currentServing = currentServing; }

    public QueueResponse getCurrentServingTicket() { return currentServingTicket; }
    public void setCurrentServingTicket(QueueResponse currentServingTicket) { this.currentServingTicket = currentServingTicket; }

    public Long getWaitingCount() { return waitingCount; }
    public void setWaitingCount(Long waitingCount) { this.waitingCount = waitingCount; }

    public Integer getAverageWaitTime() { return averageWaitTime; }
    public void setAverageWaitTime(Integer averageWaitTime) { this.averageWaitTime = averageWaitTime; }

    public List<QueueResponse> getWaitingTickets() { return waitingTickets; }
    public void setWaitingTickets(List<QueueResponse> waitingTickets) { this.waitingTickets = waitingTickets; }
}