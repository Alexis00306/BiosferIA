document.addEventListener('DOMContentLoaded', () => {
  // Función global para mostrar/ocultar contraseña
  window.togglePassword = (inputId, btn) => {
    const input = document.getElementById(inputId);
    if (!input) {
      console.warn(`No se encontró el input con ID: ${inputId}`);
      return;
    }

    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      input.type = 'password';
      btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
  };

  // Configurar todos los botones de toggle automáticamente
  const toggleButtons = document.querySelectorAll('[data-toggle="password"]');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-target');
      if (targetId) {
        togglePassword(targetId, button);
      }
    });
  });

  // También manejar botones con IDs específicos (compatibilidad con tu código actual)
  const specificButtons = [
    { buttonId: 'togglePassword', inputId: 'passwordInput' },
    { buttonId: 'toggleNewPassword', inputId: 'nuevaPassword' },
    { buttonId: 'toggleConfirmPassword', inputId: 'confirmarPassword' }
  ];

  specificButtons.forEach(({ buttonId, inputId }) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        togglePassword(inputId, button);
      });
    }
  });

  console.log('✅ Toggle de contraseñas inicializado');
});