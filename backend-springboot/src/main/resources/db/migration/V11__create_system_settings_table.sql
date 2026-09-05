CREATE TABLE system_settings (
    id BIGINT PRIMARY KEY,
    site_name VARCHAR(100) NOT NULL,
    enable_registration BOOLEAN NOT NULL DEFAULT TRUE,
    enable_appointments BOOLEAN NOT NULL DEFAULT TRUE,
    enable_queue BOOLEAN NOT NULL DEFAULT TRUE,
    enable_documents BOOLEAN NOT NULL DEFAULT TRUE,
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    max_appointments_per_day INTEGER NOT NULL DEFAULT 50,
    default_slot_duration INTEGER NOT NULL DEFAULT 30,
    working_hours_start VARCHAR(5) NOT NULL DEFAULT '09:00',
    working_hours_end VARCHAR(5) NOT NULL DEFAULT '17:00',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (id, site_name) VALUES (1, 'LAGOS STATE UNIVERSITY, LAGOS');
