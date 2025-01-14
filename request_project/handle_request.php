<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log to a file
ini_set('log_errors', 1);
ini_set('error_log', 'debug.log');

error_log("Request received");

require_once 'config/db_connection.php';

header('Content-Type: application/json');

// Log the raw POST data
error_log("Raw POST data: " . file_get_contents("php://input"));
error_log("POST array: " . print_r($_POST, true));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Test database connection
        $pdo->query("SELECT 1");
        error_log("Database connection successful");

        // Log incoming data
        error_log("Received POST data: " . print_r($_POST, true));

        // Validate required fields
        $required_fields = ['name', 'email', 'phone', 'projectTitle', 'projectType', 'description', 'timeline', 'currency', 'budget'];
        foreach ($required_fields as $field) {
            if (!isset($_POST[$field]) || empty($_POST[$field])) {
                throw new Exception("Missing required field: {$field}");
            }
        }

        $sql = "INSERT INTO project_requests (
            full_name, email, country_code, phone_number, company, 
            project_title, project_type, description,
            technologies, timeline, currency, budget,
            submission_date
        ) VALUES (
            :name, :email, :countryCode, :phoneNumber, :company,
            :projectTitle, :projectType, :description,
            :technologies, :timeline, :currency, :budget,
            NOW()
        )";

        $stmt = $pdo->prepare($sql);
        
        // Build technologies string from array if present
        $technologies = isset($_POST['tech']) ? implode(',', $_POST['tech']) : '';

        $params = [
            'name' => $_POST['name'],
            'email' => $_POST['email'],
            'countryCode' => $_POST['countryCode'],
            'phoneNumber' => $_POST['phone'],
            'company' => $_POST['company'] ?? '',
            'projectTitle' => $_POST['projectTitle'],
            'projectType' => $_POST['projectType'],
            'description' => $_POST['description'],
            'technologies' => $technologies,
            'timeline' => $_POST['timeline'],
            'currency' => $_POST['currency'],
            'budget' => $_POST['budget']
        ];

        // Log the SQL and parameters
        error_log("SQL: " . $sql);
        error_log("Parameters: " . print_r($params, true));

        $stmt->execute($params);

        echo json_encode([
            'success' => true, 
            'message' => 'Project request submitted successfully'
        ]);

    } catch(PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
        error_log("Error code: " . $e->getCode());
        error_log("Stack trace: " . $e->getTraceAsString());
        
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Database error occurred',
            'debug' => $e->getMessage()
        ]);
    } catch(Exception $e) {
        error_log("General Error: " . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Invalid request method'
    ]);
}
?>
