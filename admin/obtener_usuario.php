<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'ID de usuario requerido']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, nombre, apellido, correo, fecha_registro FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $usuario = $result->fetch_assoc();
        echo json_encode(['status' => 'ok', 'data' => $usuario]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener usuario: ' . $e->getMessage()]);
}
?>