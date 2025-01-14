CREATE TABLE project_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country_code VARCHAR(5) NOT NULL,  /* Store country code separately */
    phone_number VARCHAR(20) NOT NULL,  /* Store phone number without code */
    company VARCHAR(100),
    project_title VARCHAR(200) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255),
    timeline VARCHAR(20) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    submission_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);