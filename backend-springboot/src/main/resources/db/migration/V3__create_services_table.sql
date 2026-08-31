CREATE TABLE IF NOT EXISTS services (
                                        id BIGSERIAL PRIMARY KEY,
                                        office_id BIGINT REFERENCES offices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_services_office ON services(office_id);