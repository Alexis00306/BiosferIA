<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT id, nombre, apellido, correo, fecha_registro FROM usuarios ORDER BY fecha_registro DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode(['status' => 'ok', 'data' => $usuarios]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener usuarios: ' . $e->getMessage()]);
}
?>