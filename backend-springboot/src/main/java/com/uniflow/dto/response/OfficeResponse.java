package com.uniflow.dto.response;

import java.util.List;

public class OfficeResponse {
    private Long id;
    private String name;
    private String description;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer slotDurationMinutes;
    private Boolean active;
    private List<ServiceResponse> services;

    // Default constructor
    public OfficeResponse() {}

    // Parameterized constructor
    public OfficeResponse(Long id, String name, String description, String workingHoursStart,
                          String workingHoursEnd, Integer slotDurationMinutes, Boolean active,
                          List<ServiceResponse> services) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.workingHoursStart = workingHoursStart;
        this.workingHoursEnd = workingHoursEnd;
        this.slotDurationMinutes = slotDurationMinutes;
        this.active = active;
        this.services = services;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWorkingHoursStart() { return workingHoursStart; }
    public void setWorkingHoursStart(String workingHoursStart) { this.workingHoursStart = workingHoursStart; }

    public String getWorkingHoursEnd() { return workingHoursEnd; }
    public void setWorkingHoursEnd(String workingHoursEnd) { this.workingHoursEnd = workingHoursEnd; }

    public Integer getSlotDurationMinutes() { return slotDurationMinutes; }
    public void setSlotDurationMinutes(Integer slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public List<ServiceResponse> getServices() { return services; }
    public void setServices(List<ServiceResponse> services) { this.services = services; }
}