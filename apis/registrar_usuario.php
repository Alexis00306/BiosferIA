<?php
include "../config/conexion.php";

header('Content-Type: application/json');

$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$correo = $_POST['correo'] ?? '';
$nuevaPassword = $_POST['nuevaPassword'] ?? '';

if (empty($nombre) || empty($apellido) || empty($correo) || empty($nuevaPassword)) {
    echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar que no exista ya el correo
$check = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
$check->bind_param("s", $correo);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado']);
    exit;
}

// Hashear la contraseña
$passHash = password_hash($nuevaPassword, PASSWORD_DEFAULT);

$query = "INSERT INTO usuarios (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $nombre, $apellido, $correo, $passHash);

if ($stmt->execute()) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo registrar']);
}

$stmt->close();
$check->close();
$conn->close();
?>