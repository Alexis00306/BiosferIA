<?php
session_start();
header('Content-Type: application/json');
require "../config/conexion.php";

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No hay sesión activa']);
    exit;
}

$idUsuario = $_SESSION['usuario']['id'];

$stmt = $conn->prepare("SELECT nombre, apellido, correo FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $idUsuario);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
    echo json_encode(['status' => 'ok', 'usuario' => $usuario]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
