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
    // Verificar si el usuario tiene registros asociados
    $stmtCheck = $conn->prepare("SELECT COUNT(*) as total FROM registros WHERE id_usuario = ?");
    $stmtCheck->bind_param("i", $id);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();
    $totalRegistros = $result->fetch_assoc()['total'];

    if ($totalRegistros > 0) {
        echo json_encode(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene registros asociados']);
        exit;
    }

    // Eliminar usuario
    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'ok', 'message' => 'Usuario eliminado exitosamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Usuario no encontrado']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al eliminar usuario']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar usuario: ' . $e->getMessage()]);
}
?>