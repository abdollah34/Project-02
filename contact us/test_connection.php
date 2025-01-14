<?php
header('Content-Type: text/html; charset=utf-8');

// Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'u862171013_hamiid');
define('DB_PASSWORD', 'Ahmed1967@Bag');
define('DB_NAME', 'u862171013_messages');

echo "<h2>Database Connection Test</h2>";
echo "<div style='font-family: monospace;'>";

try {
    // Test database connection
    echo "Testing database connection...<br>";
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    echo "✅ Database connection successful!<br><br>";

    // Test table creation
    echo "Testing table creation...<br>";
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
        echo "✅ Table 'contact_messages' exists or was created successfully!<br><br>";
    } else {
        throw new Exception("Error creating table: " . $conn->error);
    }

    // Test sample insertion
    echo "Testing data insertion...<br>";
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, phone, subject, message, contact_preference) VALUES (?, ?, ?, ?, ?, ?)");
    
    $test_name = "Test User";
    $test_email = "test@example.com";
    $test_phone = "123456789";
    $test_subject = "Test Subject";
    $test_message = "This is a test message";
    $test_preference = "email";

    $stmt->bind_param("ssssss", $test_name, $test_email, $test_phone, $test_subject, $test_message, $test_preference);

    if ($stmt->execute()) {
        echo "✅ Test data inserted successfully!<br>";
        // Clean up test data
        $conn->query("DELETE FROM contact_messages WHERE email = 'test@example.com'");
        echo "✅ Test data cleaned up successfully!<br><br>";
    } else {
        throw new Exception("Error inserting test data: " . $stmt->error);
    }

    // Show table structure
    echo "Table structure:<br>";
    $result = $conn->query("DESCRIBE contact_messages");
    echo "<pre>";
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
    echo "</pre>";

    $conn->close();
    echo "✅ All tests completed successfully!";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}

echo "</div>";
echo "<style>
    body { background: #0a192f; color: #64ffda; padding: 20px; }
    h2 { color: #fff; }
    pre { background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; }
</style>";
?>
