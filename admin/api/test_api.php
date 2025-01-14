<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_clean();

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../contact us/db_config.php';
    
    echo json_encode([
        'success' => true,
        'connection' => $conn->connect_error ? 'failed' : 'success',
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
