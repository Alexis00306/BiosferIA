$('#formRecuperarPassword').on('submit', function (e) {
  e.preventDefault();

  const email = $('#emailRecover').val().trim();

  if (email === '') {
    mostrarAlertaGlobal('Por favor ingresa tu correo electrónico.', 'danger');
    return;
  }

  const $btn = $('#btnRecuperar');
  $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...');

  $.ajax({
    url: '../apis/recuperar_password.php',
    type: 'POST',
    data: { emailRecover: email },
    dataType: 'json',
    success: function (response) {
      if (response.tipo === 'success') {
        $('#formRecuperarPassword')[0].reset();
        $('#recuperarModal').modal('hide');
      }

      mostrarAlertaGlobal(response.mensaje, response.tipo || 'danger');
    },
    error: function () {
      mostrarAlertaGlobal('Error al conectar con el servidor.', 'danger');
    },
    complete: function () {
      $btn.prop('disabled', false).html('Enviar nueva contraseña');
    }
  });
});
