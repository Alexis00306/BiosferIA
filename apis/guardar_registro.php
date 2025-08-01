<?php
session_start();
header('Content-Type: application/json');
require "../config/conexion.php";

if (!isset($_SESSION['usuario']['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No hay sesión activa']);
    exit;
}

$id_usuario = $_SESSION['usuario']['id'];

// Recibir datos
$tipo = $_POST['tipo'] ?? '';
$nombre_comun = $_POST['nombre_comun'] ?? '';
$nombre_cientifico = $_POST['nombre_cientifico'] ?? '';
$ubicacion = $_POST['ubicacion'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';

if (!$tipo || !$nombre_comun || !$nombre_cientifico) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Insertar registro sin imagen primero
$stmt = $conn->prepare("INSERT INTO registros (id_usuario, tipo, nombre_comun, nombre_cientifico, ubicacion, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, '')");
$stmt->bind_param("isssss", $id_usuario, $tipo, $nombre_comun, $nombre_cientifico, $ubicacion, $descripcion);

if ($stmt->execute()) {
    $id_registro = $stmt->insert_id;

    // Guardar imagen si viene
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombreArchivo = $id_registro . '.' . $extension;
        $rutaDestino = "../public/registros/" . $nombreArchivo;

        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            // Actualizar campo imagen con solo el nombre del archivo (ej. "1.jpg")
            $update = $conn->prepare("UPDATE registros SET imagen = ? WHERE id_registro = ?");
            $update->bind_param("si", $nombreArchivo, $id_registro);
            $update->execute();
            $update->close();
        }
    }

    echo json_encode(['status' => 'ok', 'id_registro' => $id_registro]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar en la BD']);
}

$stmt->close();
$conn->close();
