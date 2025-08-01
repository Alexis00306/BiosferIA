$(document).ready(function () {
  // --- Cargar datos del usuario al cargar la página ---
  $.ajax({
    url: '../apis/obtener_datos_usuario.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      console.log(response); // <--- Muy importante para depurar
      if (response.status === 'ok') {
        $('#nombre').val(response.usuario.nombre);
        $('#apellido').val(response.usuario.apellido);
        $('#correo').val(response.usuario.correo);
      } else {
        mostrarAlertaGlobal(response.message || 'Error al cargar datos', 'danger');
      }
    },
    error: function() {
      mostrarAlertaGlobal('Error al conectar con el servidor', 'danger');
    }
  });


  // --- Enviar formulario para actualizar datos ---
  $('#editarCuentaForm').on('submit', function (e) {
    e.preventDefault();

    const nombre = $('#nombre').val().trim();
    const apellido = $('#apellido').val().trim();
    const correo = $('#correo').val().trim();
    const nuevaPassword = $('#nuevaPassword').val();

    if (!nombre || !apellido || !correo) {
      mostrarAlertaGlobal('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    $.ajax({
      url: '../apis/editar_usuario.php',
      type: 'POST',
      dataType: 'json',
      data: {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        nuevaPassword: nuevaPassword
      },
      success: function (response) {
        if (response.status === 'ok') {
          mostrarAlertaGlobal('¡Información actualizada con éxito!', 'success');
          $('#nuevaPassword').val(''); // limpiar campo contraseña
        } else {
          mostrarAlertaGlobal(response.message || 'Error al actualizar los datos', 'danger');
        }
      },
      error: function () {
        mostrarAlertaGlobal('Error al conectar con el servidor', 'danger');
      }
    });
  });

  // --- Botón para eliminar cuenta ---
  $('#btnEliminarCuenta').on('click', function () {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      $.ajax({
        url: '../apis/eliminar_cuenta.php',
        type: 'POST',
        dataType: 'json',
        success: function (response) {
          if (response.status === 'ok') {
            mostrarAlertaGlobal('Tu cuenta ha sido eliminada. Serás redirigido...', 'success');
            setTimeout(() => {
              window.location.href = '../login.php';
            }, 3000);
          } else {
            mostrarAlertaGlobal(response.message || 'No se pudo eliminar la cuenta', 'danger');
          }
        },
        error: function () {
          mostrarAlertaGlobal('Error al intentar eliminar la cuenta', 'danger');
        }
      });
    }
  });

  // --- Función auxiliar para íconos de alertas ---
  function crearIcono(tipo) {
    if (tipo === 'success') return '<i class="bi bi-check-circle-fill text-success fs-4"></i>';
    if (tipo === 'danger') return '<i class="bi bi-x-circle-fill text-danger fs-4"></i>';
    if (tipo === 'warning') return '<i class="bi bi-exclamation-triangle-fill text-warning fs-4"></i>';
    return '<i class="bi bi-info-circle-fill text-info fs-4"></i>';
  }

  // --- Función para mostrar alertas globales ---
  window.mostrarAlertaGlobal = function (mensaje, tipo = 'info', duracion = 5000) {
    const icono = crearIcono(tipo);

    const alerta = $(`
      <div class="alert alert-${tipo} alert-dismissible fade show d-flex align-items-center gap-3 w-100 w-md-auto" 
           role="alert" 
           style="max-width: 100%; padding: 0.75rem 1rem;">
        <div class="d-flex align-items-center">${icono}</div>
        <div class="fw-semibold flex-grow-1">${mensaje}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `);

    $('#alertGlobal').append(alerta);

    // Cerrar alerta después de duración
    setTimeout(() => {
      alerta.alert('close');
    }, duracion);
  };
});
