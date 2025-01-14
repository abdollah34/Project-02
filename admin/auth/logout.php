<?php
session_start();
session_destroy();
setcookie('adminToken', '', time() - 3600, '/');
header('Location: ../index.html');
?>
