<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require_once '../../contact us/db_config.php';

try {
    $debug = [
        'connection' => $conn->connect_error ? 'failed' : 'success',
        'table_info' => [],
        'sample_data' => []
    ];

    // Get table structure
    $result = $conn->query("DESCRIBE contact_messages");
    while ($row = $result->fetch_assoc()) {
        $debug['table_info'][] = $row;
    }

    // Get sample data
    $result = $conn->query("SELECT * FROM contact_messages LIMIT 1");
    while ($row = $result->fetch_assoc()) {
        $debug['sample_data'][] = $row;
    }

    echo json_encode($debug, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
