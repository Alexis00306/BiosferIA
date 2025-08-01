<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'ID de registro requerido']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            id_registro,
            id_usuario,
            nombre_comun,
            nombre_cientifico,
            descripcion,
            ubicacion,
            tipo,
            imagen,
            fecha_registro
        FROM registros 
        WHERE id_registro = ?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $registro = $result->fetch_assoc();
        echo json_encode(['status' => 'ok', 'data' => $registro]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registro no encontrado']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener registro: ' . $e->getMessage()]);
}
?>