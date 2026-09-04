package com.uniflow.controller;

import com.uniflow.model.ActivityLog;
import com.uniflow.service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/activities")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLog>> getRecentActivities() {
        System.out.println("📡 GET /activities/recent called");
        try {
            List<ActivityLog> activities = activityLogService.getRecentActivities(10);
            System.out.println("📊 Found " + activities.size() + " activities");
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            System.err.println("❌ Error getting activities: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> addTestActivity() {
        System.out.println("📡 POST /activities/test called");
        try {
            activityLogService.logActivity(
                    "Test User",
                    "Test activity from API",
                    "admin"
            );
            Map<String, String> response = new HashMap<>();
            response.put("message", "Test activity added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error adding test activity: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to add test activity");
            return ResponseEntity.status(500).body(response);
        }
    }
}