    // Variables globales
    let stream = null;
    let video = null;
    let canvas = null;

    // Filtros de la pokédex
    document.addEventListener('DOMContentLoaded', function () {
      const filterButtons = document.querySelectorAll('.btn-filter');
      const speciesItems = document.querySelectorAll('.species-item');
      const emptyState = document.getElementById('emptyState');

      filterButtons.forEach(button => {
        button.addEventListener('click', function () {
          // Remover clase active de todos los botones
          filterButtons.forEach(btn => btn.classList.remove('active'));
          // Agregar clase active al botón clickeado
          this.classList.add('active');

          const filter = this.getAttribute('data-filter');
          let visibleCount = 0;

          speciesItems.forEach(item => {
            const itemType = item.getAttribute('data-type');

            if (filter === 'all' || filter === itemType || filter === 'recent') {
              item.style.display = 'block';
              visibleCount++;
            } else {
              item.style.display = 'none';
            }
          });

          // Mostrar estado vacío si no hay elementos visibles
          if (visibleCount === 0) {
            emptyState.classList.remove('d-none');
          } else {
            emptyState.classList.add('d-none');
          }
        });
      });

      // Inicializar funcionalidad de cámara
      initializeCamera();
    });

    function initializeCamera() {
      const startBtn = document.getElementById('startCamera');
      const captureBtn = document.getElementById('capturePhoto');
      const stopBtn = document.getElementById('stopCamera');
      const cameraPreview = document.getElementById('cameraPreview');
      const captureForm = document.getElementById('captureForm');
      const cancelBtn = document.getElementById('cancelCapture');

      startBtn.addEventListener('click', async function () {
        try {
          // Crear elemento video
          if (!video) {
            video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.borderRadius = '10px';
            video.autoplay = true;
            video.muted = true;
          }

          // Solicitar acceso a la cámara
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });

          video.srcObject = stream;
          cameraPreview.innerHTML = '';
          cameraPreview.appendChild(video);

          // Actualizar botones
          startBtn.disabled = true;
          captureBtn.disabled = false;
          stopBtn.disabled = false;

        } catch (error) {
          console.error('Error al acceder a la cámara:', error);
          alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
        }
      });

      captureBtn.addEventListener('click', function () {
        if (!video) return;

        // Crear canvas para capturar la imagen
        if (!canvas) {
          canvas = document.createElement('canvas');
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Mostrar la imagen capturada
        const capturedImage = document.createElement('img');
        capturedImage.src = canvas.toDataURL('image/jpeg');
        capturedImage.style.width = '100%';
        capturedImage.style.height = '100%';
        capturedImage.style.objectFit = 'cover';
        capturedImage.style.borderRadius = '10px';

        cameraPreview.innerHTML = '';
        cameraPreview.appendChild(capturedImage);

        // Detener la cámara
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
        }

        // Mostrar formulario
        captureForm.classList.remove('d-none');

        // Actualizar botones
        startBtn.disabled = false;
        captureBtn.disabled = true;
        stopBtn.disabled = true;
      });

      stopBtn.addEventListener('click', function () {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          stream = null;
        }

        cameraPreview.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
                        <div class="mt-2">Cámara detenida</div>
                        <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
                    </div>
                `;

        // Actualizar botones
        startBtn.disabled = false;
        captureBtn.disabled = true;
        stopBtn.disabled = true;
      });

      cancelBtn.addEventListener('click', function () {
        captureForm.classList.add('d-none');
        cameraPreview.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
                        <div class="mt-2">Cámara no iniciada</div>
                        <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
                    </div>
                `;
      });
    }

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Animaciones en scroll
    function animateOnScroll() {
      const cards = document.querySelectorAll('.pokedex-card');
      cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardVisible = 150;

        if (cardTop < window.innerHeight - cardVisible) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }
      });
    }

    // Inicializar animaciones
    document.addEventListener('DOMContentLoaded', function () {
      const cards = document.querySelectorAll('.pokedex-card');
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
      });
    });

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
