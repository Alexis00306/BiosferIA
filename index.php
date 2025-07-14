<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sierra Gorda - Identificación de Biodiversidad</title>

  <!-- Bootstrap 5.3.2 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet" />

  <!-- Font Awesome 6.5 -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="public/css/index.css" />
</head>

<body>
  <?php include 'includes/navbar.html'; ?>

  <!-- Landing Page -->
  <div id="landingPage">
    <!-- Hero Section -->
    <section class="hero-section" id="inicio">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-3 fw-bold text-white mb-4">
                Descubre la <span class="text-success">Biodiversidad</span> de
                la Sierra Gorda
              </h1>
              <p class="lead text-light mb-4">
                Utiliza inteligencia artificial para identificar especies,
                registra tus hallazgos y contribuye a la conservación de una
                de las regiones más biodiversas de México.
              </p>
              <div class="d-flex flex-wrap gap-3">
                <a class="btn btn-success btn-lg px-4" href="paginas/login.php">
                  <i class="fa-solid fa-camera me-2"></i> Comenzar Ahora
                </a>
                <a class="btn btn-outline-light btn-lg px-4" href="#videos">
                  <i class="fa-solid fa-circle-play me-2"></i> Ver Videos
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image">
              <div class="floating-cards">
                <div class="card species-preview">
                  <div class="card-body text-center">
                    <i class="fa-solid fa-leaf text-success fs-1"></i>
                    <h6 class="mt-2">Flora Identificada</h6>
                  </div>
                </div>
                <div class="card species-preview">
                  <div class="card-body text-center">
                    <i class="fa-solid fa-bug text-primary fs-1"></i>
                    <h6 class="mt-2">Fauna Registrada</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Características -->
    <section class="py-5 bg-light" id="caracteristicas">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-8 text-center">
            <h2 class="display-5 fw-bold text-dark mb-3">
              Características Principales
            </h2>
            <p class="lead text-muted">
              Tecnología avanzada para la identificación y registro de
              biodiversidad
            </p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="fa-solid fa-camera text-success fs-1"></i>
                </div>
                <h5 class="fw-bold">Identificación por IA</h5>
                <p class="text-muted">
                  Sube una foto y nuestra IA identificará automáticamente la
                  especie con alta precisión.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="fa-solid fa-book text-primary fs-1"></i>
                </div>
                <h5 class="fw-bold">Registro Detallado</h5>
                <p class="text-muted">
                  Mantén un registro completo de tus avistamientos con
                  ubicación, fecha y notas personales.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="fa-solid fa-users text-warning fs-1"></i>
                </div>
                <h5 class="fw-bold">Comunidad Científica</h5>
                <p class="text-muted">
                  Comparte tus hallazgos con investigadores y contribuye a la
                  ciencia ciudadana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Videos -->
    <section class="py-5 bg-dark text-white" id="videos">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-8 text-center">
            <h2 class="display-5 fw-bold mb-3">Videos de la Sierra Gorda</h2>
            <p class="lead">
              Explora la belleza natural de Querétaro a través de estos
              documentales
            </p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="card bg-dark border-secondary">
              <div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/-vna1eF18OE?si=4OViL5-y3YRw4VMm" class="card-img-top"
                  allowfullscreen></iframe>
              </div>
              <div class="card-body">
                <h5 class="card-title text-success">
                  Biodiversidad Excepcional
                </h5>
                <p class="card-text text-light">
                  Descubre la increíble diversidad de especies que habitan en
                  la Sierra Gorda.
                </p>
                <small class="text-muted">Duración: 15:30</small>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card bg-dark border-secondary">
              <div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/oIuhR2uQ4HY?si=0U8eINXq9tGjwUui" class="card-img-top"
                  allowfullscreen></iframe>
              </div>
              <div class="card-body">
                <h5 class="card-title text-success">Flora Endémica</h5>
                <p class="card-text text-light">
                  Conoce las plantas únicas que solo se encuentran en esta
                  región montañosa.
                </p>
                <small class="text-muted">Duración: 12:45</small>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card bg-dark border-secondary">
              <div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/1V4Cnm2tuyc?si=CnbFyo7EIApca0QN" class="card-img-top"
                  allowfullscreen></iframe>
              </div>
              <div class="card-body">
                <h5 class="card-title text-success">Fauna Silvestre</h5>
                <p class="card-text text-light">
                  Observa los animales que habitan en los diversos ecosistemas
                  de la sierra.
                </p>
                <small class="text-muted">Duración: 18:20</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mapa estilo características -->
    <section class="py-5 bg-light" id="mapa">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-lg-8 text-center">
            <h2 class="display-5 fw-bold text-dark mb-3">
              Mapa de Observaciones
            </h2>
            <p class="lead text-muted">
              Visualiza tus registros y descubrimientos en un mapa interactivo
            </p>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-0">
                <div class="ratio ratio-16x9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14954.819110804262!2d-99.6317528!3d21.2193154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d3a5c7286f9c1f%3A0xe3157407b4322e2!2sSierra%20Gorda%2C%20Quer%C3%A9taro!5e0!3m2!1ses!2smx!4v1718000000000"
                    width="600" height="450" style="border: 0" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
</body>

<?php include 'includes/footer.html'; ?>


</html>