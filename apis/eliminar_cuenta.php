<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$idUsuario = $_SESSION['usuario']['id'] ?? null;

if (!$idUsuario) {
    echo json_encode(['status' => 'error', 'message' => 'No hay sesión activa']);
    exit;
}

// Eliminar usuario
$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $idUsuario);

if ($stmt->execute()) {
    session_destroy();
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar cuenta']);
}
