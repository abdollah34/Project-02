<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if ($stmt = $conn->prepare('SELECT id, password FROM admin_users WHERE username = ?')) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $hashed_password);
            $stmt->fetch();
            
            if ($password === 'Hrry7357') {  // In production, use password_verify()
                $_SESSION['loggedin'] = true;
                $_SESSION['id'] = $id;
                $_SESSION['username'] = $username;
                
                // Set a cookie for persistent login
                setcookie('adminToken', base64_encode($username . ':' . $id), time() + (86400 * 30), "/");
                
                echo json_encode([
                    'success' => true,
                    'redirect' => 'dashbord.html'
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid username']);
        }
        
        $stmt->close();
    }
    
    $conn->close();
}
?>
