<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "cleanify";

$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>