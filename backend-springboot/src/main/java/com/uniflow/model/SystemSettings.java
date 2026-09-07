package com.uniflow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_settings")
public class SystemSettings {
    @Id
    private Long id = 1L;

    @Column(name = "site_name", nullable = false)
    private String siteName = "UniFlow";

    @Lob
    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "enable_registration", nullable = false)
    private boolean enableRegistration = true;

    @Column(name = "enable_appointments", nullable = false)
    private boolean enableAppointments = true;

    @Column(name = "enable_queue", nullable = false)
    private boolean enableQueue = true;

    @Column(name = "enable_documents", nullable = false)
    private boolean enableDocuments = true;

    @Column(name = "maintenance_mode", nullable = false)
    private boolean maintenanceMode = false;

    @Column(name = "max_appointments_per_day", nullable = false)
    private int maxAppointmentsPerDay = 50;

    @Column(name = "default_slot_duration", nullable = false)
    private int defaultSlotDuration = 30;

    @Column(name = "working_hours_start", nullable = false)
    private String workingHoursStart = "09:00";

    @Column(name = "working_hours_end", nullable = false)
    private String workingHoursEnd = "17:00";

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public boolean isEnableRegistration() { return enableRegistration; }
    public void setEnableRegistration(boolean value) { this.enableRegistration = value; }
    public boolean isEnableAppointments() { return enableAppointments; }
    public void setEnableAppointments(boolean value) { this.enableAppointments = value; }
    public boolean isEnableQueue() { return enableQueue; }
    public void setEnableQueue(boolean value) { this.enableQueue = value; }
    public boolean isEnableDocuments() { return enableDocuments; }
    public void setEnableDocuments(boolean value) { this.enableDocuments = value; }
    public boolean isMaintenanceMode() { return maintenanceMode; }
    public void setMaintenanceMode(boolean value) { this.maintenanceMode = value; }
    public int getMaxAppointmentsPerDay() { return maxAppointmentsPerDay; }
    public void setMaxAppointmentsPerDay(int value) { this.maxAppointmentsPerDay = value; }
    public int getDefaultSlotDuration() { return defaultSlotDuration; }
    public void setDefaultSlotDuration(int value) { this.defaultSlotDuration = value; }
    public String getWorkingHoursStart() { return workingHoursStart; }
    public void setWorkingHoursStart(String value) { this.workingHoursStart = value; }
    public String getWorkingHoursEnd() { return workingHoursEnd; }
    public void setWorkingHoursEnd(String value) { this.workingHoursEnd = value; }
}
