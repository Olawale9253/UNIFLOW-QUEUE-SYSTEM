package com.uniflow.dto.response;

public class ServiceResponse {
    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private Boolean active;

    // Default constructor
    public ServiceResponse() {}

    // Parameterized constructor
    public ServiceResponse(Long id, String name, String description, Integer durationMinutes, Boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}