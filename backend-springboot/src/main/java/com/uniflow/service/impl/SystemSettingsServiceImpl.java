package com.uniflow.service.impl;

import com.uniflow.exception.BadRequestException;
import com.uniflow.model.SystemSettings;
import com.uniflow.model.User;
import com.uniflow.repository.SystemSettingsRepository;
import com.uniflow.repository.UserRepository;
import com.uniflow.service.NotificationService;
import com.uniflow.service.SystemSettingsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingsServiceImpl implements SystemSettingsService {
    private static final long SETTINGS_ID = 1L;

    private final SystemSettingsRepository settingsRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SystemSettingsServiceImpl(SystemSettingsRepository settingsRepository,
                                     UserRepository userRepository,
                                     NotificationService notificationService) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public SystemSettings getSettings() {
        SystemSettings settings = settingsRepository.findById(SETTINGS_ID).orElseGet(() -> {
            SystemSettings defaults = new SystemSettings();
            return settingsRepository.save(defaults);
        });
        return settings;
    }

    @Override
    @Transactional
    public SystemSettings updateSettings(SystemSettings requestedSettings) {
        SystemSettings current = getSettings();
        StringBuilder changedFeatures = new StringBuilder();
        appendChanged(changedFeatures, "Registration", current.isEnableRegistration(), requestedSettings.isEnableRegistration());
        appendChanged(changedFeatures, "Appointments", current.isEnableAppointments(), requestedSettings.isEnableAppointments());
        appendChanged(changedFeatures, "Queue system", current.isEnableQueue(), requestedSettings.isEnableQueue());
        appendChanged(changedFeatures, "Documents", current.isEnableDocuments(), requestedSettings.isEnableDocuments());
        appendChanged(changedFeatures, "Maintenance Mode", current.isMaintenanceMode(), requestedSettings.isMaintenanceMode());
        boolean changed = changedFeatures.length() > 0
            || !current.getSiteName().equals(requestedSettings.getSiteName())
            || !java.util.Objects.equals(current.getLogoUrl(), requestedSettings.getLogoUrl())
            || current.getMaxAppointmentsPerDay() != requestedSettings.getMaxAppointmentsPerDay()
            || current.getDefaultSlotDuration() != requestedSettings.getDefaultSlotDuration()
            || !current.getWorkingHoursStart().equals(requestedSettings.getWorkingHoursStart())
            || !current.getWorkingHoursEnd().equals(requestedSettings.getWorkingHoursEnd());

        current.setSiteName(requestedSettings.getSiteName());
        current.setLogoUrl(requestedSettings.getLogoUrl());
        current.setEnableRegistration(requestedSettings.isEnableRegistration());
        current.setEnableAppointments(requestedSettings.isEnableAppointments());
        current.setEnableQueue(requestedSettings.isEnableQueue());
        current.setEnableDocuments(requestedSettings.isEnableDocuments());
        current.setMaintenanceMode(requestedSettings.isMaintenanceMode());
        current.setMaxAppointmentsPerDay(requestedSettings.getMaxAppointmentsPerDay());
        current.setDefaultSlotDuration(requestedSettings.getDefaultSlotDuration());
        current.setWorkingHoursStart(requestedSettings.getWorkingHoursStart());
        current.setWorkingHoursEnd(requestedSettings.getWorkingHoursEnd());

        SystemSettings saved = settingsRepository.save(current);
        if (changed) {
            String message = "Updated: " + (changedFeatures.length() > 0 ? changedFeatures : "general system settings") + ". "
                    + (saved.isMaintenanceMode()
                    ? "The system is now in maintenance mode."
                    : "Changes are now active.");
            for (User user : userRepository.findAll()) {
                notificationService.createNotification(user.getId(), "System settings updated", message, "system");
            }
        }
        return saved;
    }

    private void appendChanged(StringBuilder changedFeatures, String name, boolean previous, boolean current) {
        if (previous != current) {
            if (changedFeatures.length() > 0) {
                changedFeatures.append(", ");
            }
            changedFeatures.append(name).append(current ? " enabled" : " disabled");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void requireAvailable(String feature) {
        SystemSettings settings = getSettings();
        if (settings.isMaintenanceMode()) {
            throw new BadRequestException("The system is currently in maintenance mode");
        }
        boolean enabled = switch (feature) {
            case "registration" -> settings.isEnableRegistration();
            case "appointments" -> settings.isEnableAppointments();
            case "queue" -> settings.isEnableQueue();
            case "documents" -> settings.isEnableDocuments();
            default -> true;
        };
        if (!enabled) {
            throw new BadRequestException("This feature is currently disabled by an administrator");
        }
    }
}
