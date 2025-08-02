<?php
require '../config/conexion.php';
header('Content-Type: application/json');
session_start();

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(["mensaje" => "Todos los campos son obligatorios", "tipo" => "danger"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, nombre, apellido, correo, password FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["mensaje" => "Correo no registrado", "tipo" => "danger"]);
    exit;
}

$usuario = $resultado->fetch_assoc();

if (!password_verify($password, $usuario['password'])) {
    echo json_encode(["mensaje" => "Contraseña incorrecta", "tipo" => "danger"]);
    exit;
}

// ✅ Guardar en sesión
$_SESSION['usuario'] = [
    "id" => $usuario['id'],
    "nombre" => $usuario['nombre'],
    "apellido" => $usuario['apellido'],
    "correo" => $usuario['correo']
];

echo json_encode(["mensaje" => "Inicio de sesión exitoso", "tipo" => "success"]);
?>