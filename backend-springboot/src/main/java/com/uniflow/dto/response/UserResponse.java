package com.uniflow.dto.response;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String matriculationNumber;
    private String email;
    private String fullName;
    private String phone;
    private String profileImageUrl;
    private String role;
    private Boolean active;
    private LocalDateTime createdAt;

    // Default constructor
    public UserResponse() {}

    // Parameterized constructor
    public UserResponse(Long id, String matriculationNumber, String email, String fullName,
                        String phone, String profileImageUrl, String role, Boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.matriculationNumber = matriculationNumber;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatriculationNumber() { return matriculationNumber; }
    public void setMatriculationNumber(String matriculationNumber) { this.matriculationNumber = matriculationNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}