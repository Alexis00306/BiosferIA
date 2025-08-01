<?php
include "../config/conexion.php";
session_start();
header('Content-Type: application/json');

$id_registro = $_POST['id_registro'] ?? '';
$id_usuario = $_POST['id_usuario'] ?? '';
$nombre_comun = $_POST['nombre_comun'] ?? '';
$nombre_cientifico = $_POST['nombre_cientifico'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$ubicacion = $_POST['ubicacion'] ?? '';
$tipo = $_POST['tipo'] ?? '';

// Verificar datos requeridos
if (empty($id_registro) || empty($id_usuario) || empty($nombre_comun) || empty($tipo)) {
    echo json_encode(['status' => 'error', 'message' => 'ID, usuario, nombre común y tipo son obligatorios']);
    exit;
}

// Verificar que el tipo sea válido
if (!in_array($tipo, ['flora', 'fauna'])) {
    echo json_encode(['status' => 'error', 'message' => 'Tipo de especie inválido']);
    exit;
}

try {
    // Obtener imagen actual
    $stmtActual = $conn->prepare("SELECT imagen FROM registros WHERE id_registro = ?");
    $stmtActual->bind_param("i", $id_registro);
    $stmtActual->execute();
    $resultActual = $stmtActual->get_result();
    $imagenActual = $resultActual->fetch_assoc()['imagen'] ?? null;

    $nombreImagen = $imagenActual; // Mantener imagen actual por defecto

    // Manejar nueva imagen si se subió
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';

        // Crear directorio si no existe
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombreImagen = uniqid() . '.' . $extension;
        $rutaCompleta = $uploadDir . $nombreImagen;

        // Verificar que sea una imagen válida
        $tiposPermitidos = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array(strtolower($extension), $tiposPermitidos)) {
            echo json_encode(['status' => 'error', 'message' => 'Tipo de imagen no permitido']);
            exit;
        }

        // Verificar tamaño (máximo 5MB)
        if ($_FILES['imagen']['size'] > 5 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'La imagen es demasiado grande (máximo 5MB)']);
            exit;
        }

        if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaCompleta)) {
            echo json_encode(['status' => 'error', 'message' => 'Error al subir la imagen']);
            exit;
        }

        // Eliminar imagen anterior si existe y es diferente
        if ($imagenActual && file_exists($uploadDir . $imagenActual)) {
            unlink($uploadDir . $imagenActual);
        }
    }

    // Actualizar registro
    $stmt = $conn->prepare("UPDATE registros SET id_usuario=?, nombre_comun=?, nombre_cientifico=?, descripcion=?, ubicacion=?, tipo=?, imagen=? WHERE id_registro=?");
    $stmt->bind_param("issssssi", $id_usuario, $nombre_comun, $nombre_cientifico, $descripcion, $ubicacion, $tipo, $nombreImagen, $id_registro);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'ok', 'message' => 'Registro actualizado exitosamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar registro']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar registro: ' . $e->getMessage()]);
}
?>