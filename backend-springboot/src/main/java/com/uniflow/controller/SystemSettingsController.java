package com.uniflow.controller;

import com.uniflow.model.SystemSettings;
import com.uniflow.service.BrandingFileService;
import com.uniflow.service.SystemSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;

@RestController
@RequestMapping("/system/settings")
public class SystemSettingsController {
    private final SystemSettingsService systemSettingsService;
    private final BrandingFileService brandingFileService;

    public SystemSettingsController(SystemSettingsService systemSettingsService,
                                    BrandingFileService brandingFileService) {
        this.systemSettingsService = systemSettingsService;
        this.brandingFileService = brandingFileService;
    }

    @GetMapping
    public ResponseEntity<SystemSettings> getSettings() {
        return ResponseEntity.ok(systemSettingsService.getSettings());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings settings) {
        return ResponseEntity.ok(systemSettingsService.updateSettings(settings));
    }

    @PostMapping("/logo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettings> uploadLogo(@RequestParam("file") MultipartFile file) throws IOException {
        String logoUrl = brandingFileService.save(file);
        SystemSettings settings = systemSettingsService.getSettings();
        settings.setLogoUrl(ServletUriComponentsBuilder.fromCurrentContextPath()
            .path(logoUrl)
            .toUriString());
        return ResponseEntity.ok(systemSettingsService.updateSettings(settings));
    }

    @GetMapping("/logo/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getLogo(@PathVariable String filename) {
        return brandingFileService.load(filename);
    }
}
