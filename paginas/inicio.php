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

  <link rel="stylesheet" href="../public/css/inicio.css" />

</head>

<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">
        <i class="fa-solid fa-tree text-success me-2"></i>
        BiosferIA
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#collection">
              <i class="fas fa-book me-1"></i>Mi Colección
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#camera">
              <i class="fas fa-camera me-1"></i>Capturar
            </a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="fas fa-user me-1"></i>Usuario
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Configuración</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container main-container">
    <!-- Estadísticas -->
    <div class="row mb-4">
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-seedling mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="floraCount">12</span>
          <small>Especies Flora</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-paw mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="faunaCount">8</span>
          <small>Especies Fauna</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-calendar mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="monthCount">3</span>
          <small>Este Mes</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-trophy mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="totalCount">20</span>
          <small>Total</small>
        </div>
      </div>
    </div>

    <!-- Sección Colección Pokédex -->
    <section id="collection" class="mb-5">
      <div class="section-header">
        <h2 class="mb-0">
          <i class="fas fa-book me-2"></i>
          Mi Colección
        </h2>
        <p class="mb-0 mt-2 opacity-75">Todas tus especies registradas</p>
      </div>
      <div class="section-content">
        <!-- Filtros -->
        <div class="filter-buttons">
          <button class="btn btn-filter active" data-filter="all">
            <i class="fas fa-globe me-1"></i>Todas
          </button>
          <button class="btn btn-filter" data-filter="flora">
            <i class="fas fa-seedling me-1"></i>Flora
          </button>
          <button class="btn btn-filter" data-filter="fauna">
            <i class="fas fa-paw me-1"></i>Fauna
          </button>
          <button class="btn btn-filter" data-filter="recent">
            <i class="fas fa-clock me-1"></i>Recientes
          </button>
        </div>

        <!-- Grid de especies -->
        <div class="row" id="speciesGrid">
          <!-- Ejemplo Flora -->
          <div class="col-lg-4 col-md-6 mb-4 species-item" data-type="flora">
            <div class="pokedex-card">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop" alt="Roble"
                class="specimen-image">
              <div class="mt-3">
                <span class="specimen-type type-flora">
                  <i class="fas fa-seedling me-1"></i>FLORA
                </span>
                <h5 class="fw-bold mb-2">Roble Común</h5>
                <p class="text-muted mb-2"><em>Quercus robur</em></p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    Parque Central
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    15/06/2025
                  </small>
                </div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-success me-2">
                    <i class="fas fa-eye me-1"></i>Ver Detalles
                  </button>
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-share me-1"></i>Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Ejemplo Fauna -->
          <div class="col-lg-4 col-md-6 mb-4 species-item" data-type="fauna">
            <div class="pokedex-card">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD6dujKi31EmiPX0jLk4XDa9bT_sFAqb41DHWrhEmQkFLs2AydB5abO6bnJ9lIEMfUz4Kgw8IMdcudS8wNTTLCcT4Y3xnp1Fd0WOaViCOc"
                alt="Mariposa" class="specimen-image">
              <div class="mt-3">
                <span class="specimen-type type-fauna">
                  <i class="fas fa-paw me-1"></i>FAUNA
                </span>
                <h5 class="fw-bold mb-2">Mariposa Monarca</h5>
                <p class="text-muted mb-2"><em>Danaus plexippus</em></p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    Jardín Botánico
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    14/06/2025
                  </small>
                </div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-success me-2">
                    <i class="fas fa-eye me-1"></i>Ver Detalles
                  </button>
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-share me-1"></i>Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Más ejemplos... -->
          <div class="col-lg-4 col-md-6 mb-4 species-item" data-type="flora">
            <div class="pokedex-card">
              <img src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=200&fit=crop" alt="Helecho"
                class="specimen-image">
              <div class="mt-3">
                <span class="specimen-type type-flora">
                  <i class="fas fa-seedling me-1"></i>FLORA
                </span>
                <h5 class="fw-bold mb-2">Helecho Común</h5>
                <p class="text-muted mb-2"><em>Pteridium aquilinum</em></p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-map-marker-alt me-1"></i>
                    Bosque Norte
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>
                    13/06/2025
                  </small>
                </div>
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-success me-2">
                    <i class="fas fa-eye me-1"></i>Ver Detalles
                  </button>
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-share me-1"></i>Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío (oculto por defecto) -->
        <div class="empty-state d-none" id="emptyState">
          <i class="fas fa-search"></i>
          <h4>No se encontraron especies</h4>
          <p>Intenta con un filtro diferente o comienza a registrar nuevas especies</p>
        </div>
      </div>
    </section>

    <!-- Sección Cámara -->
    <section id="camera" class="mb-5">
      <div class="section-header">
        <h2 class="mb-0">
          <i class="fas fa-camera me-2"></i>
          Capturar Nueva Especie
        </h2>
        <p class="mb-0 mt-2 opacity-75">Toma una foto para registrar flora o fauna</p>
      </div>
      <div class="section-content">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="camera-container">
              <div class="camera-preview" id="cameraPreview">
                <div class="text-center">
                  <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
                  <div class="mt-2">Cámara no iniciada</div>
                  <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
                </div>
              </div>

              <div class="camera-controls">
                <button class="btn btn-camera me-2" id="startCamera">
                  <i class="fas fa-video me-2"></i>
                  Iniciar Cámara
                </button>
                <button class="btn btn-camera me-2" id="capturePhoto" disabled>
                  <i class="fas fa-camera me-2"></i>
                  Capturar Foto
                </button>
                <button class="btn btn-camera" id="stopCamera" disabled>
                  <i class="fas fa-stop me-2"></i>
                  Detener
                </button>
              </div>

              <!-- Formulario de registro (aparece después de capturar) -->
              <div class="mt-4 d-none" id="captureForm">
                <div class="card">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                      <i class="fas fa-plus-circle me-2"></i>
                      Registrar Nueva Especie
                    </h5>
                  </div>
                  <div class="card-body">
                    <form>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Tipo de Especie</label>
                          <select class="form-select" required>
                            <option value="">Seleccionar...</option>
                            <option value="flora">Flora</option>
                            <option value="fauna">Fauna</option>
                          </select>
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombre Común</label>
                          <input type="text" class="form-control" placeholder="Ej: Roble, Mariposa Monarca">
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Nombre Científico</label>
                          <input type="text" class="form-control" placeholder="Ej: Quercus robur">
                        </div>
                        <div class="col-md-6 mb-3">
                          <label class="form-label">Ubicación</label>
                          <input type="text" class="form-control" placeholder="Ej: Parque Central">
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Observaciones</label>
                        <textarea class="form-control" rows="3"
                          placeholder="Describe características, comportamiento, etc."></textarea>
                      </div>
                      <div class="text-end">
                        <button type="button" class="btn btn-secondary me-2" id="cancelCapture">
                          <i class="fas fa-times me-1"></i>Cancelar
                        </button>
                        <button type="submit" class="btn btn-success">
                          <i class="fas fa-save me-1"></i>Guardar Especie
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Bootstrap 5 JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>

  <script src="../public/js/inicio.js"></script>


</body>

</html>