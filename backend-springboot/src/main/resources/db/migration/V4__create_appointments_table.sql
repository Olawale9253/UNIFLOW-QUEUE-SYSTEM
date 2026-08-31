CREATE TABLE IF NOT EXISTS appointments (
                                            id BIGSERIAL PRIMARY KEY,
                                            student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    office_id BIGINT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
    appointment_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_appointments_office ON appointments(office_id);
CREATE INDEX idx_appointments_time ON appointments(appointment_time);
CREATE INDEX idx_appointments_reference ON appointments(reference_number);