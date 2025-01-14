<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../../contact us/db_config.php';

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Database connection successful\n";
    
    $result = $conn->query("SELECT COUNT(*) as count FROM contact_messages");
    if ($result) {
        $count = $result->fetch_assoc()['count'];
        echo "Number of messages: " . $count;
    } else {
        echo "Error querying table: " . $conn->error;
    }
}
