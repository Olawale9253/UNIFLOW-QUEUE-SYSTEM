package com.uniflow.dto.request;

import jakarta.validation.constraints.NotNull;

public class QueueRequest {
    @NotNull(message = "Office ID is required")
    private Long officeId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    // Getters and Setters
    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
}