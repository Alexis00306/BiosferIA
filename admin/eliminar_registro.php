<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$id_registro = $_POST['id_registro'] ?? '';

if (empty($id_registro)) {
    echo json_encode(['status' => 'error', 'message' => 'ID de registro requerido']);
    exit;
}

try {
    // Obtener información del registro antes de eliminarlo (para eliminar la imagen)
    $stmtInfo = $conn->prepare("SELECT imagen FROM registros WHERE id_registro = ?");
    $stmtInfo->bind_param("i", $id_registro);
    $stmtInfo->execute();
    $result = $stmtInfo->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Registro no encontrado']);
        exit;
    }

    $registro = $result->fetch_assoc();
    $imagen = $registro['imagen'];

    // Eliminar registro
    $stmt = $conn->prepare("DELETE FROM registros WHERE id_registro = ?");
    $stmt->bind_param("i", $id_registro);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Eliminar imagen asociada si existe
            if ($imagen && file_exists('../uploads/' . $imagen)) {
                unlink('../uploads/' . $imagen);
            }

            echo json_encode(['status' => 'ok', 'message' => 'Registro eliminado exitosamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Registro no encontrado']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al eliminar registro']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar registro: ' . $e->getMessage()]);
}
?>