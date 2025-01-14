<?php
$host = 'localhost'; // Usually localhost or provided by Hostinger
$dbname = 'u862171013_req';
$username = 'u862171013_request';
$password = '?8NS+HZ9';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>
