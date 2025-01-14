CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user with hashed password
INSERT INTO admin_users (username, password) 
VALUES ('a.bagueri', '$2y$10$YourHashedPasswordHere');

CREATE TABLE user_settings (
    user_id INT PRIMARY KEY,
    profile_picture VARCHAR(255),
    display_name VARCHAR(100),
    email VARCHAR(100),
    email_notifications BOOLEAN DEFAULT true,
    browser_notifications BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- Insert default settings for existing admin
INSERT INTO user_settings (user_id, display_name, email) 
SELECT id, username, 'admin@example.com' FROM admin_users;