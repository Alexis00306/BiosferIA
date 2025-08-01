<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("
        SELECT 
            r.id_registro,
            r.id_usuario,
            r.nombre_comun,
            r.nombre_cientifico,
            r.descripcion,
            r.ubicacion,
            r.tipo,
            r.imagen,
            r.fecha_registro,
            u.nombre as usuario_nombre,
            u.apellido as usuario_apellido
        FROM registros r 
        INNER JOIN usuarios u ON r.id_usuario = u.id 
        ORDER BY r.fecha_registro DESC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $registros = [];
    while ($row = $result->fetch_assoc()) {
        $registros[] = $row;
    }

    echo json_encode(['status' => 'ok', 'data' => $registros]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener registros: ' . $e->getMessage()]);
}
?>