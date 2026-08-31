package com.uniflow.service;

import com.uniflow.dto.request.LoginRequest;
import com.uniflow.dto.request.RegisterRequest;
import com.uniflow.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgotPassword(String email);
    boolean verifyResetToken(String token);
    void resetPassword(String token, String newPassword);
}