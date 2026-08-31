-- Insert default offices
INSERT INTO offices (name, description, working_hours_start, working_hours_end, slot_duration_minutes) VALUES
                                                                                                           ('Bursary', 'Handles all financial and payment-related matters', '09:00', '17:00', 30),
                                                                                                           ('Registry', 'Manages student records, transcripts, and certifications', '09:00', '17:00', 30),
                                                                                                           ('Student Affairs', 'Oversees student welfare, activities, and support services', '09:00', '17:00', 30),
                                                                                                           ('Faculty Office', 'Manages faculty-specific administrative tasks', '09:00', '17:00', 30),
                                                                                                           ('Admissions Office', 'Handles student admissions and enrollment', '09:00', '17:00', 30);

-- Insert default services for Bursary
INSERT INTO services (office_id, name, description, duration_minutes) VALUES
                                                                          (1, 'Fee Payment', 'Payment of tuition and other fees', 20),
                                                                          (1, 'Fee Clearance', 'Clearance for graduation or course registration', 15),
                                                                          (1, 'Scholarship Processing', 'Processing of scholarship applications', 30);

-- Insert default services for Registry
INSERT INTO services (office_id, name, description, duration_minutes) VALUES
                                                                          (2, 'Transcript Request', 'Request for official academic transcripts', 20),
                                                                          (2, 'Certificate Verification', 'Verification of academic certificates', 15),
                                                                          (2, 'ID Card Replacement', 'Replacement of lost or damaged ID cards', 25);

-- Insert default services for Student Affairs
INSERT INTO services (office_id, name, description, duration_minutes) VALUES
                                                                          (3, 'Student Support', 'General student support services', 20),
                                                                          (3, 'Accommodation', 'Student accommodation services', 15),
                                                                          (3, 'Counseling Services', 'Student counseling and guidance', 30);

-- Insert default services for Faculty Office
INSERT INTO services (office_id, name, description, duration_minutes) VALUES
                                                                          (4, 'Course Registration', 'Registration for courses each semester', 20),
                                                                          (4, 'Department Clearance', 'Departmental clearance for graduation', 15),
                                                                          (4, 'Student Verification', 'Verification of student status', 10);

-- Insert default services for Admissions Office
INSERT INTO services (office_id, name, description, duration_minutes) VALUES
                                                                          (5, 'Admission Enquiry', 'General admission enquiries', 15),
                                                                          (5, 'Application Processing', 'Processing of admission applications', 30),
                                                                          (5, 'Admission Letter', 'Collection of admission letters', 20);