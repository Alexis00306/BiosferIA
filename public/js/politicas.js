// Sistema de gestión de políticas de privacidad y cookies
class PrivacyManager {
  constructor() {
    this.cookieName = 'sierra_gorda_privacy_accepted';
    this.init();
  }

  init() {
    // Verificar si el usuario ya aceptó las políticas
    if (!this.hasAcceptedPolicies()) {
      this.showPrivacyBanner();
    }
  }

  hasAcceptedPolicies() {
    // Verificar si existe la cookie de aceptación
    return document.cookie
      .split(';')
      .some(cookie => cookie.trim().startsWith(this.cookieName + '='));
  }

  showPrivacyBanner() {
    const banner = document.getElementById('privacyBanner');
    if (banner) {
      // Mostrar banner después de un pequeño delay para mejor UX
      setTimeout(() => {
        banner.classList.add('show');
      }, 1000);
    }
  }

  hidePrivacyBanner() {
    const banner = document.getElementById('privacyBanner');
    if (banner) {
      banner.classList.remove('show');
      // Remover del DOM después de la animación
      setTimeout(() => {
        banner.style.display = 'none';
      }, 500);
    }
  }

  acceptPolicies() {
    // Establecer cookie que expira en 1 año
    const expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 1);

    document.cookie = `${this.cookieName}=true; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict`;

    // Ocultar banner y modal si está abierto
    this.hidePrivacyBanner();
    this.closePolicyModal();

    // Mostrar mensaje de confirmación
    this.showAcceptanceMessage();
  }

  showPolicyModal() {
    const modal = document.getElementById('policyModal');
    if (modal) {
      modal.classList.add('show');
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }
  }

  closePolicyModal() {
    const modal = document.getElementById('policyModal');
    if (modal) {
      modal.classList.remove('show');
      // Restaurar scroll del body
      document.body.style.overflow = '';
    }
  }

  showAcceptanceMessage() {
    // Crear y mostrar un toast de confirmación
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 m-3 p-3 bg-success text-white rounded shadow';
    toast.style.zIndex = '10001';
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fa-solid fa-check-circle me-2"></i>
        <span>¡Políticas aceptadas! Gracias por contribuir a la conservación.</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
}

// Inicializar el sistema de privacidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.privacyManager = new PrivacyManager();
});

// Funciones globales para los event handlers
function acceptPolicies() {
  if (window.privacyManager) {
    window.privacyManager.acceptPolicies();
  }
}

function showPolicyModal() {
  if (window.privacyManager) {
    window.privacyManager.showPolicyModal();
  }
}

function closePolicyModal() {
  if (window.privacyManager) {
    window.privacyManager.closePolicyModal();
  }
}

// Cerrar modal si se hace click fuera de él
document.addEventListener('click', (e) => {
  const modal = document.getElementById('policyModal');
  if (e.target === modal) {
    closePolicyModal();
  }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePolicyModal();
  }
});