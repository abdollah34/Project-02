<?php
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'u862171013_login');
define('DB_PASSWORD', '!wDi!5!ub]8');
define('DB_NAME', 'u862171013_log');

// Create connection
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
