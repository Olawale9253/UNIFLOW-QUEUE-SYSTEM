package com.uniflow.dto.response;

import java.time.LocalDateTime;

public class AppointmentResponse {
    private Long id;
    private Long officeId;
    private String officeName;
    private String studentName;
    private String serviceName;
    private LocalDateTime appointmentTime;
    private String status;
    private String referenceNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public AppointmentResponse() {}

    // Parameterized constructor
    public AppointmentResponse(Long id, Long officeId, String officeName, String studentName, String serviceName,
                               LocalDateTime appointmentTime, String status,
                               String referenceNumber, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.officeId = officeId;
        this.officeName = officeName;
        this.studentName = studentName;
        this.serviceName = serviceName;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.referenceNumber = referenceNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}