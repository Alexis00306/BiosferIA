<?php
// Cargar dependencias
require '../public/phpmailer/src/PHPMailer.php';
require '../public/phpmailer/src/SMTP.php';
require '../public/phpmailer/src/Exception.php';
require '../config/conexion.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Verificar método
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["mensaje" => "Método no permitido", "tipo" => "danger"]);
    exit();
}

// Validar email
$email = trim($_POST['emailRecover'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["mensaje" => "Correo inválido.", "tipo" => "danger"]);
    exit();
}

// Verificar si el correo existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["mensaje" => "El correo no está registrado.", "tipo" => "danger"]);
    exit();
}

$id_usuario = $result->fetch_assoc()['id'];

// Generar nueva contraseña segura
function generarPassword($length = 12)
{
    $all = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return substr(str_shuffle($all), 0, $length);
}

$nuevaPassword = generarPassword(12);
$hashedPassword = password_hash($nuevaPassword, PASSWORD_BCRYPT);

// Actualizar contraseña en base de datos
try {
    $stmt = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashedPassword, $id_usuario);

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar la contraseña.");
    }
} catch (Exception $e) {
    echo json_encode(["mensaje" => $e->getMessage(), "tipo" => "danger"]);
    exit();
}

// Enviar correo con la nueva contraseña
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'carlosalexismaldonadocarbajal@gmail.com'; // Tu correo real
    $mail->Password = 'alzw rysa fbld tgvq'; // Contraseña de aplicación, no tu contraseña normal
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';


    $mail->setFrom('carlosalexismaldonadocarbajal@gmail.com', 'BiosferIA Soporte');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = "Recuperación de Contraseña - BiosferIA";
    $mail->Body = "
        <div style='font-family: Arial, sans-serif;'>
            <h2 style='color:#1E3A8A;'>Recuperación de Contraseña</h2>
            <p>Hola, hemos generado una nueva contraseña para ti:</p>
            <p style='font-size: 18px; color: #28a745; font-weight: bold;'>$nuevaPassword</p>
            <p>Te recomendamos iniciar sesión y cambiarla inmediatamente desde tu perfil.</p>
            <hr>
            <p style='font-size: 12px; color: gray;'>Si tú no solicitaste este cambio, por favor contacta con soporte.</p>
        </div>
    ";

    $mail->send();
    echo json_encode(["mensaje" => "Se ha enviado una nueva contraseña a tu correo.", "tipo" => "success"]);
} catch (Exception $e) {
    echo json_encode(["mensaje" => "Error al enviar el correo: {$mail->ErrorInfo}", "tipo" => "danger"]);
}
