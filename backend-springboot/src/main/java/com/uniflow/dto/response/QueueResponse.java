package com.uniflow.dto.response;

public class QueueResponse {
    private Long id;
    private String ticketNumber;
    private Integer position;
    private String status;
    private Integer estimatedWaitTime;
    private String officeName;
    private String serviceName;
    private String calledAt;
    private String completedAt;

    // Default constructor
    public QueueResponse() {}

    // Parameterized constructor
    public QueueResponse(Long id, String ticketNumber, Integer position, String status,
                         Integer estimatedWaitTime, String officeName, String serviceName,
                         String calledAt, String completedAt) {
        this.id = id;
        this.ticketNumber = ticketNumber;
        this.position = position;
        this.status = status;
        this.estimatedWaitTime = estimatedWaitTime;
        this.officeName = officeName;
        this.serviceName = serviceName;
        this.calledAt = calledAt;
        this.completedAt = completedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getCalledAt() { return calledAt; }
    public void setCalledAt(String calledAt) { this.calledAt = calledAt; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
}