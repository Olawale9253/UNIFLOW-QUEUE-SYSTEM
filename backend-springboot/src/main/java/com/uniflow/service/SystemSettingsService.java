package com.uniflow.service;

import com.uniflow.model.SystemSettings;

public interface SystemSettingsService {
    SystemSettings getSettings();
    SystemSettings updateSettings(SystemSettings requestedSettings);
    void requireAvailable(String feature);
}
