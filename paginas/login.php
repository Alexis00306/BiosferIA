<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Iniciar Sesión</title>

  <!-- Bootstrap 5 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">


  <link rel="stylesheet" href="../public/css/index.css" />

</head>

<body>

  <script src="../public/js/registrar_usuario.js"></script>
  <?php include '../includes/navbar_login.html'; ?>

  <div class="container my-5  pt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg border-0">
          <div class="card-body p-4">
            <div class="text-center mb-4">
              <img src="../public/img/logo.png" alt="Logo BiosferIA" class="img-fluid" style="max-width: 120px" />
              <h4 class="fw-bold">Iniciar Sesión</h4>
              <p class="text-muted mb-0">Accede a tu colección de flora y fauna</p>
            </div>

            <!-- Login -->
            <form action="procesar_login.php" method="POST">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <input type="email" name="email" id="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" name="password" id="password" class="form-control" required>
              </div>
              <a type="submit" class="btn btn-success w-100" href="../paginas/inicio.php">
                <i class="fas fa-sign-in-alt me-2"></i>Ingresar
              </a>
            </form>

            <!-- Texto y botón de Google abajo del login tradicional -->
            <div class="text-center my-3 text-muted">o iniciar con Google</div>
            <div class="mb-4 text-center">
              <div id="g_id_onload" data-client_id="TU_CLIENT_ID_AQUI" data-context="signin" data-ux_mode="popup"
                data-callback="handleCredentialResponse" data-auto_prompt="false">
              </div>

              <div class="g_id_signin" data-type="standard" data-shape="pill" data-theme="outline"
                data-text="signin_with" data-size="large" data-logo_alignment="left">
              </div>
            </div>

            <div class="text-center mt-2">
              <a href="#" class="text-muted small" data-bs-toggle="modal" data-bs-target="#registroModal">¿No tienes
                cuenta? Regístrate</a>
            </div>

            <div class="text-center mt-2">
              <a type="email" href="#" class="text-muted small" data-bs-toggle="modal" data-bs-target="#recuperarModal">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Registro -->
  <?php include '../modales/modal_registro.html'; ?>
  <!-- Modal Recuperar Contraseña -->
  <?php include '../modales/modal_recuperar_password.html'; ?>

  <!-- Footer -->
  <?php include '../includes/footer.html'; ?>

  <!-- Scripts -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
  <script>
    function handleCredentialResponse(response) {
      fetch('login_google.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            window.location.href = 'inicio.php';
          } else {
            alert('Error al iniciar sesión con Google');
          }
        });
    }
  </script>

  <!-- Contenedor para alertas flotantes generales -->
  <div id="alertGlobal" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;"></div>

</body>

</html>