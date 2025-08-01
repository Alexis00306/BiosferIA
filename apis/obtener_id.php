<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    // Redirige si no está autenticado (opcional)
    header("Location: login.php");
    exit;
}

$id_usuario = $_SESSION['usuario']['id'];
?>