package com.uniflow.service;

import com.uniflow.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getUserProfile(Long userId);
    UserResponse updateUser(Long userId, String fullName, String phone, String email);
    UserResponse updateUserRole(Long userId, String newRole);
    UserResponse updateUserProfile(Long userId, String fullName, String phone);
    List<UserResponse> getAllUsers();
    UserResponse activateUser(Long userId);
    UserResponse deactivateUser(Long userId);
}