<?php
session_start();
require_once '../auth/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['loggedin'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['id'];
    $response = ['success' => true, 'message' => ''];

    // Handle profile updates
    if (isset($_POST['type']) && $_POST['type'] === 'profile') {
        $display_name = trim($_POST['name']);
        $email = trim($_POST['email']);
        
        $stmt = $conn->prepare('UPDATE user_settings SET display_name = ?, email = ? WHERE user_id = ?');
        $stmt->bind_param('ssi', $display_name, $email, $user_id);
        
        if (!$stmt->execute()) {
            $response = ['success' => false, 'message' => 'Failed to update profile'];
        }
    }

    // Handle notification settings
    if (isset($_POST['type']) && $_POST['type'] === 'notifications') {
        $email_notifications = $_POST['emailNotifications'] === 'true' ? 1 : 0;
        $browser_notifications = $_POST['browserNotifications'] === 'true' ? 1 : 0;
        
        $stmt = $conn->prepare('UPDATE user_settings SET email_notifications = ?, browser_notifications = ? WHERE user_id = ?');
        $stmt->bind_param('iii', $email_notifications, $browser_notifications, $user_id);
        
        if (!$stmt->execute()) {
            $response = ['success' => false, 'message' => 'Failed to update notifications'];
        }
    }

    echo json_encode($response);
    $conn->close();
}
?>
