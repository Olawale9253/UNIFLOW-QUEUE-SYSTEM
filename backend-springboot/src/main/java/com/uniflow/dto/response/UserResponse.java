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
    private Long officeId;
    private String officeName;
    private Boolean active;
    private Boolean approved;
    private LocalDateTime createdAt;

    // Default constructor
    public UserResponse() {}

    // Parameterized constructor
    public UserResponse(Long id, String matriculationNumber, String email, String fullName,
                        String phone, String profileImageUrl, String role, Long officeId, String officeName,
                        Boolean active, Boolean approved, LocalDateTime createdAt) {
        this.id = id;
        this.matriculationNumber = matriculationNumber;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
        this.officeId = officeId;
        this.officeName = officeName;
        this.active = active;
        this.approved = approved;
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

    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}