<?php
include "../config/conexion.php";

header('Content-Type: application/json');

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$pass = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);

// Validar que no exista ya el correo
$check = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
$check->bind_param("s", $correo);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado']);
    exit;
}

$query = "INSERT INTO usuarios (nombre, apellido, correo, contraseña) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $nombre, $apellido, $correo, $pass);


if ($stmt->execute()) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo registrar']);
}
?>