package com.uniflow.service.impl;

import com.uniflow.dto.request.LoginRequest;
import com.uniflow.dto.request.RegisterRequest;
import com.uniflow.dto.response.AuthResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.UnauthorizedException;
import com.uniflow.model.User;
import com.uniflow.repository.UserRepository;
import com.uniflow.security.JwtTokenProvider;
import com.uniflow.service.AuthService;
import com.uniflow.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    // Reset token expiration time in minutes
    private static final int RESET_TOKEN_EXPIRY_MINUTES = 15;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        if (userRepository.existsByMatriculationNumber(request.getMatriculationNumber())) {
            throw new BadRequestException("Matriculation number is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setMatriculationNumber(request.getMatriculationNumber());

        String role = request.getRole() != null ? request.getRole() : "STUDENT";
        if (!Arrays.asList("STUDENT", "STAFF", "ADMIN").contains(role)) {
            role = "STUDENT";
        }
        user.setRole(role);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Send welcome email
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        String token = jwtTokenProvider.generateToken(savedUser);

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);

        // Set expiration to 15 minutes from now
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES));
        userRepository.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        System.out.println("========================================");
        System.out.println("PASSWORD RESET REQUEST");
        System.out.println("Email: " + email);
        System.out.println("Reset Token: " + resetToken);
        System.out.println("Reset Link: " + resetLink);
        System.out.println("Expires in: " + RESET_TOKEN_EXPIRY_MINUTES + " minutes");
        System.out.println("========================================");

        // Send email
        try {
            emailService.sendPasswordResetEmail(email, resetLink);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Override
    public boolean verifyResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        // Check if token has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired. Please request a new password reset link.");
        }

        return true;
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        // Check if token has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired. Please request a new password reset link.");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}