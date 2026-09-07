package com.uniflow.service;

import com.uniflow.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getUserProfile(Long userId);
    UserResponse updateUser(Long userId, String fullName, String phone, String email, String profileImageUrl, Long officeId);
    UserResponse updateUserRole(Long userId, String newRole);
    UserResponse updateUserProfile(Long userId, String fullName, String phone, String matriculationNumber, String profileImageUrl);
    List<UserResponse> getAllUsers();
    List<UserResponse> getStaffByOffice(Long officeId);
    UserResponse activateUser(Long userId);
    UserResponse deactivateUser(Long userId);
    UserResponse approveUser(Long userId);
    UserResponse rejectUser(Long userId);
    void changePassword(Long userId, String currentPassword, String newPassword);
}