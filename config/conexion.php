<?php
$conn = new mysqli("localhost", "root", "", "biosferia");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>