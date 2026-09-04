package com.uniflow.service;

import com.uniflow.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getUserNotifications(Long userId);
    NotificationResponse createNotification(Long userId, String title, String message, String type);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
