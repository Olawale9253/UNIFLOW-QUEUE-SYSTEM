package com.uniflow.controller;

import com.uniflow.dto.request.CreateStaffRequest;
import com.uniflow.dto.response.UserResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.UserService;
import com.uniflow.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ActivityLogService activityLogService;

    // Explicit constructor
    public UserController(UserService userService, ActivityLogService activityLogService) {
        this.userService = userService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = userService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        UserResponse response = userService.createStaff(request);
        activityLogService.logActivity("Admin", "Created staff account: " + response.getFullName(), "admin");
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String fullName = request.get("fullName");
        String phone = request.get("phone");
        String email = request.get("email");
        String profileImageUrl = request.get("profileImageUrl");
        Long officeId = request.get("officeId") == null ? null : Long.valueOf(request.get("officeId"));

        UserResponse response = userService.updateUser(userId, fullName, phone, email, profileImageUrl, officeId);
        activityLogService.logActivity("Admin", "Updated staff/user: " + response.getFullName(), "admin");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        userService.changePassword(userDetails.getId(), currentPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        UserResponse response = userService.updateUserRole(userId, newRole);
        activityLogService.logActivity("Admin", "Updated role for user ID " + userId + " to " + newRole, "admin");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request) {
        UserResponse response = userService.updateUserProfile(
                userDetails.getId(), request.get("fullName"), request.get("phone"),
                null, request.get("profileImageUrl"));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = userService.getAllUsers();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/office/{officeId}/staff")
    public ResponseEntity<List<UserResponse>> getStaffByOffice(@PathVariable Long officeId) {
        return ResponseEntity.ok(userService.getStaffByOffice(officeId));
    }

    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long userId) {
        UserResponse response = userService.activateUser(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long userId) {
        UserResponse response = userService.approveUser(userId);
        activityLogService.logActivity("Admin", "Approved account: " + response.getFullName(), "admin");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> rejectUser(@PathVariable Long userId) {
        UserResponse response = userService.rejectUser(userId);
        activityLogService.logActivity("Admin", "Rejected account: " + response.getFullName(), "admin");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long userId) {
        UserResponse response = userService.deactivateUser(userId);
        activityLogService.logActivity("Admin", "Removed staff/user ID " + userId, "admin");
        return ResponseEntity.ok(response);
    }
}