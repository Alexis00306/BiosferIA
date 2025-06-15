<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inicio de Sesión - Sierra Gorda</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>


  <link rel="stylesheet" href="../public/css/estilos.css" />
  <link rel="stylesheet" href="../public/css/index.css" />

</head>

<?php include '../includes/navbar_login.html'; ?>


<body class="min-vh-100 d-flex flex-column">
  <div class="container-fluid flex-grow-1">
    <div class="row h-100 flex-column flex-md-row">
      <!-- Panel Izquierdo (imagen y texto) -->
      <div class="col-md-6 d-flex justify-content-center align-items-center text-white text-center p-5 bg-cover">
        <div>
          <h1 class="display-3 fw-bold text-info mb-4">
            <span class="text-white">Biosfer</span>IA
          </h1>
          <p class="mt-3 fs-5">
            Bienvenido al portal para identificar especies de la Sierra Gorda
            de Querétaro. Ayuda a preservar su biodiversidad de manera activa.
          </p>
        </div>
      </div>

      <!-- Panel Derecho (login + logo) -->
      <div class="col-md-6 d-flex justify-content-center align-items-center bg-light p-5">
        <div class="w-100" style="max-width: 400px">
          <!-- LOGO -->
          <div class="text-center mb-auto">
            <img src="../public/img/logo.png" alt="Logo BiosferIA" class="img-fluid" style="max-width: 120px" />
          </div>

          <h2 class="mb-4 text-center">Iniciar sesión</h2>

          <form>
            <div class="mb-3">
              <label for="correo" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="correo" placeholder="ejemplo@correo.com" required />
            </div>

            <div class="mb-3">
              <label for="contrasena" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="contrasena" placeholder="••••••••" required />
            </div>

            <div class="d-grid mb-3">
              <a type="submit" class="btn btn-primary" href="../paginas/inicio.php">
                Iniciar sesión
              </a>
            </div>
          </form>

          <div class="text-center my-3">
            <span>o</span>
          </div>

          <a href="#" class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" width="20" />
            Iniciar sesión con Google
          </a>
        </div>
      </div>
    </div>
  </div>

</body>

<?php include '../includes/footer.html'; ?>

</html>