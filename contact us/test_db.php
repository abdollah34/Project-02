<?php
header('Content-Type: text/html; charset=utf-8');

// Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'u862171013_hamiid');
define('DB_PASSWORD', 'Ahmed1967@Bag');
define('DB_NAME', 'u862171013_messages');

echo "<div style='font-family: Arial; padding: 20px;'>";
echo "<h2>Database Connection Test</h2>";

try {
    // Test database connection
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo "✅ Connected to database successfully!<br><br>";

    // Test table creation
    $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        contact_preference VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($sql)) {
        echo "✅ Table created/exists successfully!<br>";
    } else {
        throw new Exception("Error creating table: " . $conn->error);
    }

    // Show tables
    $result = $conn->query("SHOW TABLES");
    echo "<br>Existing tables:<br>";
    while ($row = $result->fetch_array()) {
        echo "📋 " . $row[0] . "<br>";
    }

    $conn->close();

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}

echo "</div>";
?>
