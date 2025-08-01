document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('formLogin');
  const btnSubmit = loginForm.querySelector('button[type="submit"]');
  const animSuccess = document.getElementById('loginSuccessAnimation');
  
  // Usar los selectores exactos de tu HTML
  const emailInput = loginForm.querySelector('input[name="email"]');
  const passwordInput = document.getElementById('passwordInput');

  // Patrón para validar contraseña fuerte
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  
  if (animSuccess) {
    animSuccess.classList.add('d-none');
  }

  function ocultarTodoMenosAnimacion() {
    document.body.querySelectorAll('body > *:not(#loginSuccessAnimation)').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Función para validar email
  function validarEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Función para validar contraseña con requisitos de fortaleza
  function validarPassword(password) {
    console.log('🔍 Validando contraseña:', password);
    
    if (password.trim().length === 0) {
      return {
        isValid: false,
        message: 'La contraseña es requerida.'
      };
    }

    // Validar cada requisito individualmente
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[\W_]/.test(password)
    };
    
    console.log('📊 Requisitos de contraseña:', requirements);
    
    const allRequirementsMet = Object.values(requirements).every(req => req === true);
    
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
    
    console.log('✅ Contraseña válida');
    return { isValid: true, message: '' };
  }

  // Validación en tiempo real para email
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      
      // Limpiar cualquier mensaje de error previo del servidor
      const loginAlert = document.getElementById('loginAlert');
      if (loginAlert && !loginAlert.classList.contains('d-none')) {
        loginAlert.classList.add('d-none');
      }
      
      if (email.length > 0) {
        if (validarEmail(email)) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      } else {
        this.classList.remove('is-valid', 'is-invalid');
      }
    });
  }

  // Validación en tiempo real para contraseña
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      
      // Limpiar cualquier mensaje de error previo del servidor
      const loginAlert = document.getElementById('loginAlert');
      if (loginAlert && !loginAlert.classList.contains('d-none')) {
        loginAlert.classList.add('d-none');
      }
      
      if (password.length > 0) {
        const validation = validarPassword(password);
        if (validation.isValid) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      } else {
        this.classList.remove('is-valid', 'is-invalid');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      console.log('🚀 Iniciando validación de login...');

      // 1. Validar email
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !validarEmail(email)) {
        // Usar tu función showAlert existente
        showAlert('danger', 'Por favor, ingresa un correo electrónico válido.');
        if (emailInput) {
          emailInput.classList.add('is-invalid');
          emailInput.focus();
        }
        return;
      }

      // 2. Validar contraseña
      const password = passwordInput ? passwordInput.value : '';
      const passwordValidation = validarPassword(password);
      if (!passwordValidation.isValid) {
        // Usar tu función showAlert existente
        showAlert('danger', passwordValidation.message);
        if (passwordInput) {
          passwordInput.classList.add('is-invalid');
          passwordInput.focus();
        }
        return;
      }

      // 3. Si las validaciones pasan, continuar con el login original
      console.log('✅ Todas las validaciones pasaron, enviando datos...');

      const datos = new FormData(this);

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Iniciando...
        `;
      }

      fetch('../apis/iniciar_sesion.php', {
        method: 'POST',
        body: datos
      })
        .then(response => response.json())
        .then(data => {
          console.log('📥 Respuesta del servidor:', data);
          
          if (data.tipo === 'success') {
            // Limpiar clases de validación y mostrar éxito
            if (emailInput) {
              emailInput.classList.remove('is-invalid');
              emailInput.classList.add('is-valid');
            }
            if (passwordInput) {
              passwordInput.classList.remove('is-invalid');
              passwordInput.classList.add('is-valid');
            }

            ocultarTodoMenosAnimacion();
            loginForm.classList.add('d-none');
            if (animSuccess) {
              animSuccess.classList.remove('d-none');
            }

            setTimeout(() => {
              window.location.href = '../paginas/inicio.php';
            }, 2500);
          } else {
            // Usar tu función showAlert existente
            showAlert('danger', data.mensaje);
            
            // NO marcar campos como inválidos si ya pasaron la validación
            // Solo mostrar el mensaje de error del servidor
            console.log('❌ Error de credenciales del servidor:', data.mensaje);
          }
        })
        .catch((error) => {
          console.error('❌ Error de conexión:', error);
          // Usar tu función showAlert existente
          showAlert('danger', 'Error al conectar con el servidor.');
        })
        .finally(() => {
          if (btnSubmit && !loginForm.classList.contains('d-none')) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Iniciar Sesión';
          }
        });
    });
  }

  console.log('✅ Validación de login inicializada');
  console.log('📧 Email input:', emailInput);
  console.log('🔒 Password input:', passwordInput);
});