<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Colección - Flora y Fauna</title>

  <!-- Bootstrap 5 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>


  <!-- Bootstrap 5 JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>

  <link rel="stylesheet" href="../public/css/inicio.css" />

</head>

<body>

  <?php include '../includes/navbar_inicio.html'; ?>
  <?php include '../apis/obtener_id.php'; ?>

  <script src="../public/js/configuracion.js"></script>

<!-- Sección de Configuración de Cuenta -->
<section id="accountSettings" class="mb-5 mt-5">
  <div class="container" style="max-width: 800px;"> <!-- Limita el ancho -->
    <div class="section-header mb-4">
      <h2 class="mb-0">
        <i class="fas fa-user-cog me-2"></i> Configuración de Cuenta
      </h2>
      <p class="mb-0 mt-2 opacity-75">Actualiza tu información personal o elimina tu cuenta</p>
    </div>

    <div class="section-content">
      <form id="editarCuentaForm" class="row g-3">
        <div class="col-md-6">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" class="form-control" id="nombre" name="nombre" required>
        </div>
        <div class="col-md-6">
          <label for="apellido" class="form-label">Apellido</label>
          <input type="text" class="form-control" id="apellido" name="apellido" required>
        </div>
        <div class="col-md-6">
          <label for="correo" class="form-label">Correo electrónico</label>
          <input type="email" class="form-control" id="correo" name="correo" readonly>
        </div>
        <div class="col-md-6">
          <label for="nuevaPassword" class="form-label">Nueva Contraseña</label>
          <input type="password" class="form-control" id="nuevaPassword" name="nuevaPassword" placeholder="Deja en blanco para mantener la actual">
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-success">
            <i class="fas fa-save me-1"></i>Guardar Cambios
          </button>
        </div>
      </form>

      <hr class="my-4">

      <div class="text-end">
        <button id="btnEliminarCuenta" class="btn btn-danger">
          <i class="fas fa-trash-alt me-1"></i>Eliminar Cuenta
        </button>
      </div>
    </div>
  </div>
</section>

 <!-- Contenedor para alertas flotantes generales -->
  <div id="alertGlobal" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;"></div>

<?php include '../includes/footer.html'; ?>

</body>