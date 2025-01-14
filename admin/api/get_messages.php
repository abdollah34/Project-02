<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Prevent any HTML output before headers
ob_clean();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Add error handler to catch any PHP errors
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/../../contact us/db_config.php';

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Get filter parameters
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $contact = isset($_GET['contact']) ? $_GET['contact'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';

    // Build query
    $query = "SELECT * FROM contact_messages WHERE 1=1";
    
    if ($status !== 'all') {
        $query .= " AND read_status = " . intval($status);
    }
    
    if ($contact !== 'all') {
        $query .= " AND contact_preference = '" . $conn->real_escape_string($contact) . "'";
    }
    
    if ($search) {
        $search = $conn->real_escape_string($search);
        $query .= " AND (name LIKE '%$search%' OR email LIKE '%$search%' OR subject LIKE '%$search%')";
    }
    
    $query .= " ORDER BY created_at DESC";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            'id' => (int)$row['id'],
            'name' => htmlspecialchars($row['name']),
            'email' => htmlspecialchars($row['email']),
            'phone' => htmlspecialchars($row['phone'] ?? ''),
            'subject' => htmlspecialchars($row['subject']),
            'message' => htmlspecialchars($row['message']),
            'contact_preference' => $row['contact_preference'] ?? 'email',
            'read_status' => (int)($row['read_status'] ?? 0),
            'created_at' => $row['created_at']
        ];
    }

    echo json_encode([
        'success' => true, 
        'messages' => $messages,
        'count' => count($messages)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}

$conn->close();
