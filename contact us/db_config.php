<?php
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'u862171013_hamiid');
define('DB_PASSWORD', 'Ahmed1967@Bag');
define('DB_NAME', 'u862171013_messages');

// Create database connection
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create table if not exists
$sql = "CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    contact_preference VARCHAR(50) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    time_preference VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($sql)) {
    echo "Error creating table: " . $conn->error;
}
?>
