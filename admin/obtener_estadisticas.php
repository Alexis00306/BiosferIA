<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

// Verificar que sea un administrador (puedes ajustar esta lógica según tu sistema)
// if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'admin') {
//     echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
//     exit;
// }

try {
    // Obtener total de usuarios
    $stmtUsuarios = $conn->prepare("SELECT COUNT(*) as total FROM usuarios");
    $stmtUsuarios->execute();
    $totalUsuarios = $stmtUsuarios->get_result()->fetch_assoc()['total'];

    // Obtener total de registros de flora
    $stmtFlora = $conn->prepare("SELECT COUNT(*) as total FROM registros WHERE tipo = 'flora'");
    $stmtFlora->execute();
    $totalFlora = $stmtFlora->get_result()->fetch_assoc()['total'];

    // Obtener total de registros de fauna
    $stmtFauna = $conn->prepare("SELECT COUNT(*) as total FROM registros WHERE tipo = 'fauna'");
    $stmtFauna->execute();
    $totalFauna = $stmtFauna->get_result()->fetch_assoc()['total'];

    // Obtener total de registros
    $stmtTotal = $conn->prepare("SELECT COUNT(*) as total FROM registros");
    $stmtTotal->execute();
    $totalRegistros = $stmtTotal->get_result()->fetch_assoc()['total'];

    echo json_encode([
        'status' => 'ok',
        'data' => [
            'usuarios' => $totalUsuarios,
            'flora' => $totalFlora,
            'fauna' => $totalFauna,
            'total_registros' => $totalRegistros
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener estadísticas: ' . $e->getMessage()]);
}
?>