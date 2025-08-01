<?php
session_start();
header('Content-Type: application/json');
require "../config/conexion.php";

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No hay sesión activa']);
    exit;
}

$idUsuario = $_SESSION['usuario']['id'];

try {
    // Contar total de especies
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM registros WHERE id_usuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $total = $stmt->get_result()->fetch_assoc()['total'];

    // Contar flora
    $stmt = $conn->prepare("SELECT COUNT(*) as flora FROM registros WHERE id_usuario = ? AND tipo = 'flora'");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $flora = $stmt->get_result()->fetch_assoc()['flora'];

    // Contar fauna
    $stmt = $conn->prepare("SELECT COUNT(*) as fauna FROM registros WHERE id_usuario = ? AND tipo = 'fauna'");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $fauna = $stmt->get_result()->fetch_assoc()['fauna'];

    // Contar especies de este mes
    $stmt = $conn->prepare("
        SELECT COUNT(*) as este_mes 
        FROM registros 
        WHERE id_usuario = ? 
        AND MONTH(fecha_registro) = MONTH(CURRENT_DATE()) 
        AND YEAR(fecha_registro) = YEAR(CURRENT_DATE())
    ");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $esteMes = $stmt->get_result()->fetch_assoc()['este_mes'];

    echo json_encode([
        'status' => 'ok',
        'estadisticas' => [
            'total' => (int) $total,
            'flora' => (int) $flora,
            'fauna' => (int) $fauna,
            'este_mes' => (int) $esteMes
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
    ]);
}

$stmt->close();
$conn->close();
?>