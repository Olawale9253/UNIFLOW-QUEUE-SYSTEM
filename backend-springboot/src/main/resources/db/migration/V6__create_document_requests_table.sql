CREATE TABLE IF NOT EXISTS document_requests (
                                                 id BIGSERIAL PRIMARY KEY,
                                                 student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    office_id BIGINT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    tracking_number VARCHAR(20) UNIQUE NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_documents_student ON document_requests(student_id);
CREATE INDEX idx_documents_tracking ON document_requests(tracking_number);
CREATE INDEX idx_documents_status ON document_requests(status);