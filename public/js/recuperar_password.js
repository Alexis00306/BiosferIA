$('#formRecuperarPassword').submit(function (e) {
  e.preventDefault();
  const email = $('#emailRecover').val();

  $.ajax({
    type: 'POST',
    url: '../apis/registrar_usuario.php',
    data: { emailRecover: email },
    dataType: 'json',
    success: function (res) {
      const alertClass =
        res.tipo === 'success' ? 'alert-success' : 'alert-danger';
      $('#alertRecuperar').html(`
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
          ${res.mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      `);

      if (res.tipo === 'success') {
        $('#formRecuperarPassword')[0].reset();
      }
    },
    error: function () {
      $('#alertRecuperar').html(`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Error al procesar la solicitud. Intenta de nuevo más tarde.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      `);
    }
  });
});
