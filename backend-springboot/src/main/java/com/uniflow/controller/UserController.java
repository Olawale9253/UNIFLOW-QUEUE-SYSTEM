package com.uniflow.controller;

import com.uniflow.dto.response.UserResponse;
import com.uniflow.security.CustomUserDetails;
import com.uniflow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // Explicit constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = userService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String fullName = request.get("fullName");
        String phone = request.get("phone");
        String email = request.get("email");

        UserResponse response = userService.updateUser(userId, fullName, phone, email);
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
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String matriculationNumber,
            @RequestParam(required = false) String profileImageUrl) {
        UserResponse response = userService.updateUserProfile(
                userDetails.getId(), fullName, phone, matriculationNumber, profileImageUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> responses = userService.getAllUsers();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long userId) {
        UserResponse response = userService.activateUser(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long userId) {
        UserResponse response = userService.deactivateUser(userId);
        return ResponseEntity.ok(response);
    }
}