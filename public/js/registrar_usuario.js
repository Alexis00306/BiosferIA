$(document).ready(function () {
  // Patrón para validar contraseña fuerte
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Función para verificar requisitos de contraseña
  function validarFortalezaPassword(password) {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[\W_]/.test(password)
    };
    
    const allRequirementsMet = Object.values(requirements).every(req => req === true);
    
    // Debug para ver qué está pasando
    console.log('Validando contraseña:', password);
    console.log('Requisitos:', requirements);
    console.log('Todos cumplidos:', allRequirementsMet);
    
    if (!allRequirementsMet) {
      const missing = [];
      if (!requirements.length) missing.push('al menos 8 caracteres');
      if (!requirements.lowercase) missing.push('una letra minúscula');
      if (!requirements.uppercase) missing.push('una letra mayúscula');
      if (!requirements.number) missing.push('un número');
      if (!requirements.symbol) missing.push('un símbolo');
      
      return {
        isValid: false,
        message: `La contraseña debe contener: ${missing.join(', ')}.`
      };
    }
    
    return { isValid: true, message: '' };
  }

  // Validación en tiempo real para mejor UX
  $('#nuevaPassword').on('input', function() {
    const password = $(this).val();
    if (password.length > 0) {
      const validation = validarFortalezaPassword(password);
      if (validation.isValid) {
        $(this).removeClass('is-invalid').addClass('is-valid');
      } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
      }
    } else {
      $(this).removeClass('is-valid is-invalid');
    }
  });

  $('#confirmarPassword').on('input', function() {
    const password = $('#nuevaPassword').val();
    const confirmPassword = $(this).val();
    
    if (confirmPassword.length > 0) {
      if (password === confirmPassword) {
        $(this).removeClass('is-invalid').addClass('is-valid');
      } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
      }
    } else {
      $(this).removeClass('is-valid is-invalid');
    }
  });

  $('#registroForm').on('submit', function (e) {
    e.preventDefault();

    const pass1 = $('#nuevaPassword').val();
    const pass2 = $('#confirmarPassword').val();

    // 1. Validar fortaleza de contraseña PRIMERO
    const validationResult = validarFortalezaPassword(pass1);
    if (!validationResult.isValid) {
      mostrarAlertaGlobal(validationResult.message, 'danger');
      $('#nuevaPassword').addClass('is-invalid').removeClass('is-valid');
      return; // Detener aquí si la contraseña no es fuerte
    }

    // 2. Validar que las contraseñas coincidan
    if (pass1 !== pass2) {
      mostrarAlertaGlobal('Las contraseñas no coinciden', 'danger');
      $('#confirmarPassword').addClass('is-invalid').removeClass('is-valid');
      return; // Detener aquí si no coinciden
    }

    // 3. Validar otros campos requeridos
    const nombre = $('#nombre').val().trim();
    const apellido = $('#apellido').val().trim();
    const correo = $('#correo').val().trim();

    if (!nombre || !apellido || !correo) {
      mostrarAlertaGlobal('Todos los campos son obligatorios', 'danger');
      return;
    }

    // 4. Validar formato de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
      mostrarAlertaGlobal('Ingresa un correo electrónico válido', 'danger');
      $('#correo').addClass('is-invalid').removeClass('is-valid');
      return;
    }

    // 5. Si todas las validaciones pasan, enviar datos
    console.log('✅ Todas las validaciones pasaron, enviando datos...');

    // Deshabilitar botón mientras se procesa
    const $submitBtn = $(this).find('button[type="submit"]');
    const originalText = $submitBtn.html();
    $submitBtn.prop('disabled', true).html(`
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Registrando...
    `);

    $.ajax({
      url: '../apis/registrar_usuario.php',
      type: 'POST',
      data: {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        nuevaPassword: pass1
      },
      dataType: 'json',
      success: function (response) {
        console.log('Respuesta del servidor:', response);
        
        if (response.status === 'ok') {
          $('#registroForm')[0].reset();
          
          // Limpiar clases de validación
          $('#registroForm .is-valid, #registroForm .is-invalid').removeClass('is-valid is-invalid');
          
          $('#registroModal').modal('hide');
          mostrarAlertaGlobal('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
        } else {
          mostrarAlertaGlobal(response.message || 'Error al registrar', 'danger');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error AJAX:', { xhr, status, error });
        mostrarAlertaGlobal('Error al conectar con el servidor', 'danger');
      },
      complete: function() {
        // Rehabilitar botón
        $submitBtn.prop('disabled', false).html(originalText);
      }
    });
  });

  function crearIcono(tipo) {
    if (tipo === 'success') return '<i class="bi bi-check-circle-fill text-success fs-4"></i>';
    if (tipo === 'danger') return '<i class="bi bi-x-circle-fill text-danger fs-4"></i>';
    if (tipo === 'warning') return '<i class="bi bi-exclamation-triangle-fill text-warning fs-4"></i>';
    return '<i class="bi bi-info-circle-fill text-info fs-4"></i>';
  }

  window.mostrarAlertaGlobal = function (mensaje, tipo = 'info', duracion = 5000) {
    const icono = crearIcono(tipo);

    const alerta = $(`
      <div class="alert alert-${tipo} alert-dismissible fade show d-flex align-items-center gap-3 w-100 w-md-auto"
           role="alert"
           style="max-width: 100%; padding: 0.75rem 1rem;">
             
        <!-- Ícono -->
        <div class="d-flex align-items-center">
          ${icono}
        </div>
         
        <!-- Mensaje -->
        <div class="fw-semibold flex-grow-1">
          ${mensaje}
        </div>
         
        <!-- Botón cerrar -->
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    `);

    $('#alertGlobal').append(alerta);

    setTimeout(() => {
      alerta.alert('close');
    }, duracion);
  };
});