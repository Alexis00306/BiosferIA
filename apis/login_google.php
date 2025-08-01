<?php
// Configuración de debugging - NO mostrar errores en salida, solo en log
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_error.log'); // archivo para errores

ini_set('max_execution_time', 30); // 30 segundos máximo

// Iniciar buffering para evitar salida prematura
ob_start();

// Log personalizado
function logDebug($message)
{
  error_log("[LOGIN_GOOGLE] " . $message);
}

logDebug("=== INICIO SCRIPT ===");

// Verificar si es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  logDebug("ERROR: Método no es POST");
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

// Iniciar sesión
if (session_status() === PHP_SESSION_NONE) {
  session_start();
  logDebug("Sesión iniciada");
} else {
  logDebug("Sesión ya estaba activa");
}

// Incluir conexión
try {
  require '../config/conexion.php';
  logDebug("Conexión incluida correctamente");

  // Verificar conexión
  if (!$conn) {
    logDebug("ERROR: Conexión no establecida");
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Error de conexión a BD']);
    exit;
  }

  if ($conn->connect_error) {
    logDebug("ERROR: " . $conn->connect_error);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Error conectando a BD']);
    exit;
  }

} catch (Exception $e) {
  logDebug("EXCEPCIÓN en conexión: " . $e->getMessage());
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Error de configuración']);
  exit;
}

header('Content-Type: application/json');

// Leer datos POST
$input = file_get_contents("php://input");
logDebug("Input raw: " . substr($input, 0, 100) . "...");

$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  logDebug("ERROR JSON: " . json_last_error_msg());
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'JSON inválido']);
  exit;
}

if (!isset($data['credential'])) {
  logDebug("ERROR: credential no encontrado en data");
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Token no recibido']);
  exit;
}

$token = $data['credential'];
logDebug("Token recibido (primeros 50 chars): " . substr($token, 0, 50) . "...");

// Validar token con Google
logDebug("Iniciando validación con Google...");

$url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($token);
$curl = curl_init($url);

curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_SSL_VERIFYPEER => false, // Solo para desarrollo local
  CURLOPT_USERAGENT => 'BiosferIA-LoginApp/1.0',
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_MAXREDIRS => 3
]);

$response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curl_error = curl_error($curl);
$curl_info = curl_getinfo($curl);
curl_close($curl);

logDebug("Respuesta Google - HTTP: $http_code, Error: $curl_error");
logDebug("Tiempo total CURL: " . $curl_info['total_time'] . "s");

if ($response === false) {
  logDebug("CURL falló completamente");
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Error de conexión con Google']);
  exit;
}

if (!empty($curl_error)) {
  logDebug("CURL Error: $curl_error");
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Error CURL: ' . $curl_error]);
  exit;
}

if ($http_code !== 200) {
  logDebug("HTTP Code incorrecto: $http_code - Response: " . substr($response, 0, 200));
  ob_clean();
  echo json_encode(['success' => false, 'message' => "Error HTTP $http_code de Google"]);
  exit;
}

$google_data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  logDebug("ERROR decodificando respuesta Google: " . json_last_error_msg());
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Respuesta inválida de Google']);
  exit;
}

logDebug("Datos Google decodificados correctamente");

if (!isset($google_data['email']) || !isset($google_data['sub'])) {
  logDebug("ERROR: Datos faltantes en respuesta Google");
  logDebug("Respuesta completa: " . json_encode($google_data));
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Token inválido o expirado']);
  exit;
}

$google_id = $google_data['sub'];
$correo = $google_data['email'];
$nombre = $google_data['given_name'] ?? '';
$apellido = $google_data['family_name'] ?? '';

logDebug("Usuario Google: $correo");

// VERIFICAR SI ES ADMINISTRADOR
$correo_admin = "carlosalexismaldonadocarbajal@gmail.com";
$es_administrador = ($correo === $correo_admin);

logDebug("¿Es administrador? " . ($es_administrador ? "SÍ" : "NO"));

// Buscar usuario en BD
logDebug("Consultando usuario en BD...");

$stmt = $conn->prepare("SELECT id, nombre, correo, google_id FROM usuarios WHERE correo = ?");

if (!$stmt) {
  logDebug("ERROR preparando consulta: " . $conn->error);
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Error preparando consulta']);
  exit;
}

$stmt->bind_param("s", $correo);

if (!$stmt->execute()) {
  logDebug("ERROR ejecutando consulta: " . $stmt->error);
  ob_clean();
  echo json_encode(['success' => false, 'message' => 'Error ejecutando consulta']);
  exit;
}

$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

logDebug("Usuario encontrado: " . ($usuario ? "SÍ (ID: {$usuario['id']})" : "NO"));

if ($usuario) {
  // Usuario existente
  if (empty($usuario['google_id'])) {
    logDebug("Actualizando google_id para usuario existente");
    $update = $conn->prepare("UPDATE usuarios SET google_id = ? WHERE correo = ?");

    if (!$update) {
      logDebug("ERROR preparando UPDATE: " . $conn->error);
      ob_clean();
      echo json_encode(['success' => false, 'message' => 'Error actualizando usuario']);
      exit;
    }

    $update->bind_param("ss", $google_id, $correo);

    if (!$update->execute()) {
      logDebug("ERROR ejecutando UPDATE: " . $update->error);
      ob_clean();
      echo json_encode(['success' => false, 'message' => 'Error actualizando usuario']);
      exit;
    }

    $update->close();
  }

  $_SESSION['usuario'] = [
    'id' => $usuario['id'],
    'nombre' => $usuario['nombre'],
    'correo' => $usuario['correo'],
    'es_admin' => $es_administrador  // Marcar como administrador solo si es el correo específico
  ];

  logDebug("Sesión creada para usuario existente - ID: " . $_SESSION['usuario']['id']);

  // Redirección según tipo de usuario
  if ($es_administrador) {
    ob_clean();
    echo json_encode([
      'success' => true,
      'message' => 'Acceso concedido como administrador',
      'redirect' => '../paginas/panel_administrador.php'
    ]);
  } else {
    ob_clean();
    echo json_encode([
      'success' => true,
      'message' => 'Sesión iniciada correctamente',
      'redirect' => '../paginas/inicio.php'
    ]);
  }

} else {
  // Usuario nuevo
  logDebug("Creando nuevo usuario...");

  $insert = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, google_id) VALUES (?, ?, ?, ?)");

  if (!$insert) {
    logDebug("ERROR preparando INSERT: " . $conn->error);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Error creando usuario']);
    exit;
  }

  $insert->bind_param("ssss", $nombre, $apellido, $correo, $google_id);

  if (!$insert->execute()) {
    logDebug("ERROR ejecutando INSERT: " . $insert->error);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Error guardando usuario']);
    exit;
  }

  $nuevo_id = $conn->insert_id;
  $insert->close();

  $_SESSION['usuario'] = [
    'id' => $nuevo_id,
    'nombre' => $nombre,
    'correo' => $correo,
    'es_admin' => $es_administrador  // Marcar como administrador solo si es el correo específico
  ];

  logDebug("Usuario creado correctamente - ID: $nuevo_id");

  // Redirección según tipo de usuario
  if ($es_administrador) {
    ob_clean();
    echo json_encode([
      'success' => true,
      'message' => 'Cuenta de administrador creada y acceso concedido',
      'redirect' => '../paginas/panel_administrador.php'
    ]);
  } else {
    ob_clean();
    echo json_encode([
      'success' => true,
      'message' => 'Usuario registrado y sesión iniciada',
      'redirect' => '../paginas/inicio.php'
    ]);
  }
}

$stmt->close();
$conn->close();

logDebug("=== FIN SCRIPT EXITOSO ===");
exit;
?>