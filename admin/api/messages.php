<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../contact us/db_config.php';

try {
    // Get single message if ID is provided
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM contact_messages WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $message = $result->fetch_assoc();
        
        if ($message) {
            echo json_encode(['success' => true, 'message' => $message]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Message not found']);
        }
        exit;
    }

    // Handle unread count
    if (isset($_GET['unread-count'])) {
        $result = $conn->query("SELECT COUNT(*) as count FROM contact_messages WHERE read_status = 0");
        $count = $result->fetch_assoc()['count'];
        echo json_encode(['success' => true, 'count' => $count]);
        exit;
    }

    // Get all messages with filters
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $contact = isset($_GET['contact']) ? $_GET['contact'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';

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

    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }

    echo json_encode(['success' => true, 'messages' => $messages]);

} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
