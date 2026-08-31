CREATE TABLE IF NOT EXISTS queue_tickets (
                                             id BIGSERIAL PRIMARY KEY,
                                             student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    office_id BIGINT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
    ticket_number VARCHAR(20) NOT NULL,
    position INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    estimated_wait_time INTEGER,
    called_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_queue_office ON queue_tickets(office_id);
CREATE INDEX idx_queue_student ON queue_tickets(student_id);
CREATE INDEX idx_queue_status ON queue_tickets(status);
CREATE UNIQUE INDEX idx_queue_ticket_number ON queue_tickets(ticket_number, office_id);