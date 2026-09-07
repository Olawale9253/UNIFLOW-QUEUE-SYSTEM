package com.uniflow.dto.response;

public class DashboardStatsResponse {
    private Long totalStudents;
    private Long totalAppointments;
    private Long totalQueueTickets;
    private Long totalDocumentRequests;
    private Long todayAppointments;
    private Long todayQueueTickets;
    private Long pendingAppointments;
    private Long completedAppointments;
    private Double averageWaitTime;
    private Long totalOffices;
    private Long totalServices;
    private Long totalStaff;

    // Default constructor
    public DashboardStatsResponse() {}

    // Getters and Setters
    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(Long totalAppointments) { this.totalAppointments = totalAppointments; }

    public Long getTotalQueueTickets() { return totalQueueTickets; }
    public void setTotalQueueTickets(Long totalQueueTickets) { this.totalQueueTickets = totalQueueTickets; }

    public Long getTotalDocumentRequests() { return totalDocumentRequests; }
    public void setTotalDocumentRequests(Long totalDocumentRequests) { this.totalDocumentRequests = totalDocumentRequests; }

    public Long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(Long todayAppointments) { this.todayAppointments = todayAppointments; }

    public Long getTodayQueueTickets() { return todayQueueTickets; }
    public void setTodayQueueTickets(Long todayQueueTickets) { this.todayQueueTickets = todayQueueTickets; }

    public Long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(Long pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public Long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(Long completedAppointments) { this.completedAppointments = completedAppointments; }

    public Double getAverageWaitTime() { return averageWaitTime; }
    public void setAverageWaitTime(Double averageWaitTime) { this.averageWaitTime = averageWaitTime; }

    public Long getTotalOffices() { return totalOffices; }
    public void setTotalOffices(Long totalOffices) { this.totalOffices = totalOffices; }

    public Long getTotalServices() { return totalServices; }
    public void setTotalServices(Long totalServices) { this.totalServices = totalServices; }

    public Long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(Long totalStaff) { this.totalStaff = totalStaff; }
}