<?php
$conn = new mysqli("sql311.infinityfree.com", "if0_39614995", "BiosferIa123", "if0_39614995_biosfiera");

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>