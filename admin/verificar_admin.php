<?php
// verificar_admin.php - Archivo para proteger el panel de administrador

session_start();

// Función para redireccionar con mensaje
function redirectWithMessage($url, $message, $type = 'error')
{
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
    header("Location: $url");
    exit;
}

// Verificar si hay sesión activa
if (!isset($_SESSION['usuario'])) {
    redirectWithMessage('login.php', 'Debes iniciar sesión para acceder al panel de administrador.');
}

// Verificar si es administrador
$correo_admin = "carlosalexismaldonadocarbajal@gmail.com";
$usuario_correo = $_SESSION['usuario']['correo'] ?? '';

if ($usuario_correo !== $correo_admin) {
    // Log del intento de acceso no autorizado
    error_log("[SECURITY] Intento de acceso no autorizado al panel admin: " . $usuario_correo);

    // Destruir sesión por seguridad
    session_destroy();

    redirectWithMessage('login.php', 'Acceso denegado. Solo el administrador puede acceder a esta sección.');
}

// Si llega aquí, el usuario está autorizado
// Marcar como administrador en la sesión si no está marcado
if (!isset($_SESSION['usuario']['es_admin'])) {
    $_SESSION['usuario']['es_admin'] = true;
}

// Log de acceso exitoso
error_log("[ADMIN_ACCESS] Acceso autorizado al panel admin: " . $usuario_correo);
?>