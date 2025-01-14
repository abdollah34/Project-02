-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS u862171013_messages;
USE u862171013_messages;

-- Drop existing table if needed
DROP TABLE IF EXISTS contact_messages;

-- Create contact messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Full name of the contact',
    email VARCHAR(100) NOT NULL COMMENT 'Email address',
    phone VARCHAR(20) NOT NULL COMMENT 'Phone number',
    subject VARCHAR(200) NOT NULL COMMENT 'Message subject',
    message TEXT NOT NULL COMMENT 'Message content',
    contact_preference VARCHAR(50) NOT NULL COMMENT 'Preferred contact method',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add read_status column to existing table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS read_status TINYINT(1) DEFAULT 0;

-- Add indexes
CREATE INDEX idx_email ON contact_messages(email);
CREATE INDEX idx_created_at ON contact_messages(created_at);
CREATE INDEX idx_read_status ON contact_messages(read_status);

-- Add validation trigger
DELIMITER //
CREATE TRIGGER before_contact_insert
BEFORE INSERT ON contact_messages
FOR EACH ROW
BEGIN
    SET NEW.email = LOWER(NEW.email);
    IF NEW.contact_preference NOT IN ('email', 'phone', 'whatsapp') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid contact preference';
    END IF;
END;//
DELIMITER ;

-- Grant minimal required permissions (no user creation, only permissions)
GRANT SELECT, INSERT, UPDATE ON u862171013_messages.* TO 'u862171013_hamiid'@'localhost';
GRANT SELECT, INSERT, UPDATE ON u862171013_messages.* TO 'u862171013_hamiid'@'%';
FLUSH PRIVILEGES;
