<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$idUsuario = $_SESSION['usuario']['id'];
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$correo = $_POST['correo'] ?? '';
$nuevaPassword = $_POST['nuevaPassword'] ?? '';

// Verificar datos requeridos
if (empty($nombre) || empty($apellido) || empty($correo)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos excepto la contraseña son obligatorios.']);
    exit;
}

// Verificar que el correo no esté duplicado
$stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? AND id != ?");
$stmtCheck->bind_param("si", $correo, $idUsuario);
$stmtCheck->execute();
$res = $stmtCheck->get_result();

if ($res->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está en uso por otro usuario.']);
    exit;
}

// Si el usuario quiere actualizar la contraseña
if (!empty($nuevaPassword)) {
    $hash = password_hash($nuevaPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apellido=?, correo=?, contraseña=? WHERE id=?");
    $stmt->bind_param("ssssi", $nombre, $apellido, $correo, $hash, $idUsuario);
} else {
    $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apellido=?, correo=? WHERE id=?");
    $stmt->bind_param("sssi", $nombre, $apellido, $correo, $idUsuario);
}

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok', 'message' => 'Información actualizada.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar.']);
}
