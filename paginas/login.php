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
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <link rel="stylesheet" href="../public/css/index.css" />
</head>

<body>

  <?php include '../includes/navbar_login.html'; ?>

  <div class="container my-5 pt-5">
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
            <form id="formLogin" class="mt-4 needs-validation" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control" name="email" required>
                <div class="invalid-feedback">Ingresa un correo válido.</div>
              </div>

              <div class="mb-3 position-relative">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <input type="password" class="form-control" name="password" id="passwordInput" required
                    title="Debe contener al menos 1 mayúscula, 1 minúscula, 1 número, 1 símbolo y mínimo 8 caracteres" />
                  <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <div class="invalid-feedback">
                  La contraseña debe tener al menos una mayúscula, una minúscula, un número, un símbolo y mínimo 8
                  caracteres.
                </div>
              </div>

              <div id="loginAlert" class="alert d-none"></div>

              <button type="submit" class="btn btn-success w-100">Iniciar Sesión</button>
            </form>

            <!-- Texto y botón de Google abajo del login tradicional -->
            <div class="text-center my-3 text-muted">o iniciar con Google</div>
            <div class="mb-4">
              <div id="g_id_onload"
                data-client_id="387628405879-4d6gjcgqp7asvfmglejera41oal5ltm2.apps.googleusercontent.com"
                data-context="signin" data-ux_mode="popup" data-callback="handleCredentialResponse"
                data-auto_prompt="false">
              </div>

              <div class="d-flex justify-content-center">
                <div class="g_id_signin" data-type="standard" data-shape="pill" data-theme="outline"
                  data-text="signin_with" data-size="large" data-logo_alignment="left">
                </div>
              </div>
            </div>

            <div class="text-center mt-2">
              <a href="#" class="text-muted small" data-bs-toggle="modal" data-bs-target="#registroModal">¿No tienes
                cuenta? Regístrate</a>
            </div>

            <div class="text-center mt-2">
              <a href="#" class="text-muted small" data-bs-toggle="modal" data-bs-target="#recuperarModal">
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

  <script>
    function handleCredentialResponse(response) {
      console.log("Token recibido de Google:", response);

      // Mostrar loading si tienes un indicador
      const loadingIndicator = document.getElementById('loading');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
      }

      fetch('../apis/login_google.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ credential: response.credential })
      })
        .then(async res => {
          console.log('Status de respuesta:', res.status);

          const contentType = res.headers.get("Content-Type") || "";
          console.log('Content-Type:', contentType);

          const responseBody = await res.text();
          console.log('Respuesta cruda:', responseBody);

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${responseBody}`);
          }

          const isJson = contentType.includes("application/json");
          if (!isJson) {
            throw new Error("El servidor no devolvió JSON válido. Respuesta: " + responseBody.substring(0, 200));
          }

          const data = JSON.parse(responseBody);
          console.log("Respuesta procesada:", data);

          if (data.success) {
            // Mostrar mensaje de éxito
            showAlert('success', data.message);

            // Verificar si hay redirección específica
            if (data.redirect) {
              console.log('Redirigiendo a:', data.redirect);
              setTimeout(() => {
                window.location.href = data.redirect;
              }, 1500);
            } else {
              // Redirección por defecto
              setTimeout(() => {
                window.location.href = '../paginas/inicio.php';
              }, 1500);
            }
          } else {
            showAlert('danger', data.message || "Error al iniciar sesión con Google.");
          }
        })
        .catch(err => {
          console.error("Error completo en el login con Google:", err);
          showAlert('danger', "Error de conexión: " + err.message);
        })
        .finally(() => {
          // Ocultar loading
          if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
          }
        });
    }

    // Función para mostrar alertas mejorada
    function showAlert(type, message) {
      // Buscar contenedor existente o crear uno
      let alertContainer = document.getElementById('alertGlobal');
      if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertGlobal';
        alertContainer.className = 'position-fixed top-0 end-0 p-3';
        alertContainer.style.zIndex = '1055';
        document.body.appendChild(alertContainer);
      }

      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
      alertDiv.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

      alertContainer.appendChild(alertDiv);

      // Auto-remover después de 5 segundos
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.remove();
        }
      }, 5000);
    }

    // Inicializar Google Sign-In con configuración mejorada
    window.onload = function () {
      console.log("Inicializando Google Sign-In...");

      google.accounts.id.initialize({
        client_id: "387628405879-4d6gjcgqp7asvfmglejera41oal5ltm2.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false // Evita algunos problemas de CORS
      });

      // Renderizar el botón
      const buttonDiv = document.getElementById("buttonDiv");
      if (buttonDiv) {
        google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: 300
        });
      }

      // Comentar esta línea si da problemas de CORS
      // google.accounts.id.prompt();
    };
  </script>

  <!-- Contenedor para alertas flotantes generales -->
  <div id="alertGlobal" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;"></div>

  <!-- Animación de inicio de sesión exitoso -->
  <div id="loginSuccessAnimation" class="d-flex flex-column align-items-center justify-content-center"
    style="height: 200px; display: none;">
    <div class="butterfly">
      <div class="wing left"></div>
      <div class="wing right"></div>
      <div class="body"></div>
    </div>
    <p class="mt-3 fs-5 fw-bold text-success">¡Inicio de sesión exitoso!</p>
  </div>

  <!-- JS personalizados -->
  <script src="../public/js/registrar_usuario.js"></script>
  <script src="../public/js/recuperar_password.js"></script>
  <script src="../public/js/iniciar_sesion.js"></script>
  <script src="../public/js/mostrar_password.js"></script>

  <!-- Google Sign-In SDK -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>

  <!-- Bootstrap Bundle JS con Popper -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>


</body>

</html>