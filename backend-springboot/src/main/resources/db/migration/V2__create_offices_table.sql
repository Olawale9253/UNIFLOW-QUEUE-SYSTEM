CREATE TABLE IF NOT EXISTS offices (
                                       id BIGSERIAL PRIMARY KEY,
                                       name VARCHAR(100) NOT NULL,
    description TEXT,
    working_hours_start VARCHAR(10),
    working_hours_end VARCHAR(10),
    slot_duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_offices_name ON offices(name);