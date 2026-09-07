package com.uniflow.service;

import com.uniflow.model.ActivityLog;
import com.uniflow.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void logActivity(String username, String action, String type) {
        try {
            ActivityLog log = new ActivityLog();
            log.setUsername(username);
            log.setAction(action);
            log.setType(type);
            log.setTimestamp(LocalDateTime.now());
            activityLogRepository.save(log);
            System.out.println("✅ Activity logged: " + username + " - " + action);
        } catch (Exception e) {
            System.err.println("❌ Error logging activity: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<ActivityLog> getRecentActivities(int limit) {
        try {
            return activityLogRepository.findAllByOrderByTimestampDesc();
        } catch (Exception e) {
            System.err.println("❌ Error fetching activities: " + e.getMessage());
            return List.of();
        }
    }

    public List<ActivityLog> getActivitiesForUser(String username) {
        return activityLogRepository.findByUsernameOrderByTimestampDesc(username);
    }
}