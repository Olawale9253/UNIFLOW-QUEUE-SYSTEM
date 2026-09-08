package com.uniflow.service.impl;

import com.uniflow.dto.request.CreateStaffRequest;
import com.uniflow.dto.response.UserResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.ResourceNotFoundException;
import com.uniflow.model.User;
import com.uniflow.model.Office;
import com.uniflow.repository.UserRepository;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.service.UserService;
import com.uniflow.service.NotificationService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final OfficeRepository officeRepository;

    // Add passwordEncoder to constructor
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           NotificationService notificationService, OfficeRepository officeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
        this.officeRepository = officeRepository;
    }

    @Override
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createStaff(CreateStaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByMatriculationNumber(request.getMatriculationNumber())) {
            throw new BadRequestException("Matriculation number is already registered");
        }

        Office office = officeRepository.findById(request.getOfficeId())
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));
        if (userRepository.existsByRoleAndOfficeIdAndActiveTrueAndIdNot("STAFF", request.getOfficeId(), -1L)) {
            throw new BadRequestException("This office already has an assigned staff member");
        }

        User user = new User();
        user.setMatriculationNumber(request.getMatriculationNumber());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole("STAFF");
        user.setOffice(office);
        user.setActive(true);
        user.setApproved(true);

        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(Long userId, String fullName, String phone, String matriculationNumber, String profileImageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (matriculationNumber != null && !matriculationNumber.isEmpty()) {
            user.setMatriculationNumber(matriculationNumber);
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl);
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getStaffByOffice(Long officeId) {
        return userRepository.findByRoleAndOfficeId("STAFF", officeId).stream()
                .filter(User::isActive)
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        User updatedUser = userRepository.save(user);
        notificationService.createNotification(userId, "Account activated", "Your UniFlow account has been activated.", "system");
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        User updatedUser = userRepository.save(user);
        notificationService.createNotification(userId, "Account deactivated", "Your UniFlow account has been deactivated by an administrator.", "error");
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, String fullName, String phone, String email,
                                   String profileImageUrl, Long officeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (email != null && !email.isEmpty()) {
            if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
                throw new BadRequestException("Email is already taken");
            }
            user.setEmail(email);
        }
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            user.setProfileImageUrl(profileImageUrl);
        }
        if (officeId != null) {
            Office office = officeRepository.findById(officeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Office not found"));
            if ("STAFF".equals(user.getRole()) && userRepository.existsByRoleAndOfficeIdAndActiveTrueAndIdNot("STAFF", officeId, userId)) {
                throw new BadRequestException("This office already has an assigned staff member");
            }
            user.setOffice(office);
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!List.of("STUDENT", "STAFF", "ADMIN").contains(newRole)) {
            throw new BadRequestException("Invalid role: " + newRole);
        }

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        notificationService.createNotification(userId, "Account role updated", "Your UniFlow account role is now " + newRole + ".", "system");
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Check if new password is same as current
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from current password");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getMatriculationNumber(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getProfileImageUrl(),
                user.getRole(),
                user.getOffice() != null ? user.getOffice().getId() : null,
                user.getOffice() != null ? user.getOffice().getName() : null,
                user.isActive(),
                user.isApproved(),
                user.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public UserResponse approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(true);
        user.setActive(true);
        User updatedUser = userRepository.save(user);
        notificationService.createNotification(userId, "Account approved", "Your UniFlow account has been approved.", "system");
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setApproved(false);
        user.setActive(false);
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }
}