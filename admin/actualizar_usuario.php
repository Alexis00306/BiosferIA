<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$correo = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? '';

// Verificar datos requeridos
if (empty($id) || empty($nombre) || empty($apellido) || empty($correo)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos excepto la contraseña son obligatorios']);
    exit;
}

// Verificar que el correo no esté duplicado
$stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE correo = ? AND id != ?");
$stmtCheck->bind_param("si", $correo, $id);
$stmtCheck->execute();
$res = $stmtCheck->get_result();

if ($res->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está en uso por otro usuario']);
    exit;
}

try {
    // Si se proporciona nueva contraseña, actualizarla también
    if (!empty($password)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apellido=?, correo=?, contraseña=? WHERE id=?");
        $stmt->bind_param("ssssi", $nombre, $apellido, $correo, $hash, $id);
    } else {
        $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apellido=?, correo=? WHERE id=?");
        $stmt->bind_param("sssi", $nombre, $apellido, $correo, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['status' => 'ok', 'message' => 'Usuario actualizado exitosamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar usuario']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar usuario: ' . $e->getMessage()]);
}
?>