<?php
session_start();
header('Content-Type: application/json');
require "../config/conexion.php";

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No hay sesión activa']);
    exit;
}

$idUsuario = $_SESSION['usuario']['id'];

// Obtener filtro opcional
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'all';
$recientes = isset($_GET['recientes']) ? $_GET['recientes'] : false;

// Construir la consulta base
$sql = "SELECT id_registro, nombre_comun, nombre_cientifico, descripcion, ubicacion, tipo, imagen, fecha_registro 
        FROM registros 
        WHERE id_usuario = ?";

$params = [$idUsuario];
$types = "i";

// Aplicar filtros
if ($tipo !== 'all' && ($tipo === 'flora' || $tipo === 'fauna')) {
    $sql .= " AND tipo = ?";
    $params[] = $tipo;
    $types .= "s";
}

// Filtro de recientes (últimos 7 días)
if ($recientes) {
    $sql .= " AND fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}

// Ordenar por fecha más reciente
$sql .= " ORDER BY fecha_registro DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$resultado = $stmt->get_result();

$especies = [];
while ($fila = $resultado->fetch_assoc()) {
    // Formatear la fecha
    $fecha = new DateTime($fila['fecha_registro']);
    $fila['fecha_formateada'] = $fecha->format('d/m/Y');
    $fila['fecha_completa'] = $fecha->format('d/m/Y H:i');

    $especies[] = $fila;
}

echo json_encode([
    'status' => 'ok',
    'especies' => $especies,
    'total' => count($especies)
]);

$stmt->close();
$conn->close();
?>