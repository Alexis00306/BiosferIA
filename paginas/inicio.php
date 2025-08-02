<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mi Colección - Flora y Fauna</title>

  <!-- Bootstrap 5 CSS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />

  <!-- Bootstrap 5 JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>


  <link rel="stylesheet" href="../public/css/inicio.css" />
</head>

<body>

  <?php include '../includes/navbar_inicio.html'; ?>
  <script src="../public/js/registro.js" defer></script>
  <script src="../public/js/mostrar_especies.js" defer></script>
  <?php include '../apis/obtener_id.php'; ?>

  <div class="container main-container">
    <!-- Estadísticas -->
    <div class="row mb-4">
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-seedling mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="totalFlora">12</span>
          <small>Especies Flora</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-paw mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="totalFauna">8</span>
          <small>Especies Fauna</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-calendar mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="especiesEsteMes">3</span>
          <small>Este Mes</small>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="stats-card">
          <i class="fas fa-trophy mb-2" style="font-size: 2rem;"></i>
          <span class="stats-number" id="totalEspecies">20</span>
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
          <div class="col-12">
            <div class="camera-container">
              <div class="camera-preview" id="cameraPreview">
                <div class="text-center">
                  <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
                  <div class="mt-2">Cámara no iniciada</div>
                  <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
                </div>
              </div>

              <div class="camera-controls">
                <button class="btn btn-camera" id="startCamera">
                  <i class="fas fa-video me-2"></i>
                  <span class="d-none d-sm-inline">Iniciar </span>Cámara
                </button>
                <button class="btn btn-camera" id="capturePhoto" disabled>
                  <i class="fas fa-camera me-2"></i>
                  <span class="d-none d-sm-inline">Capturar </span>Foto
                </button>
                <button class="btn btn-info" id="captureLens">
                  <i class="fas fa-glasses me-2"></i>
                  <span class="d-none d-sm-inline">Capturar con </span>Lentes
                </button>
                <button class="btn btn-camera" id="stopCamera" disabled>
                  <i class="fas fa-stop me-2"></i>
                  <span class="d-none d-sm-inline">Detener</span>
                </button>
                <!-- El botón de alternar cámara se agregará dinámicamente aquí -->
              </div>

              <!-- Formulario de registro (oculto inicialmente) -->
              <div class="mt-4 d-none" id="captureForm">
                <div class="card">
                  <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                      <i class="fas fa-plus-circle me-2"></i>
                      Registrar Nueva Especie
                    </h5>
                  </div>
                  <div class="card-body">
                    <form id="formRegistro" enctype="multipart/form-data">
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Tipo de Especie</label>
                          <select class="form-select" id="tipo" name="tipo" required>
                            <option value="">Seleccionar...</option>
                            <option value="flora">Flora</option>
                            <option value="fauna">Fauna</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Nombre Común</label>
                          <input type="text" class="form-control" id="nombreComun" name="nombre_comun"
                            placeholder="Ej: Roble" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Nombre Científico</label>
                          <input type="text" class="form-control" id="nombreCientifico" name="nombre_cientifico"
                            placeholder="Ej: Quercus robur" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Ubicación</label>
                          <input type="text" class="form-control" id="ubicacion" name="ubicacion"
                            placeholder="Ej: Parque Central" />
                          <input type="hidden" id="latitud" name="latitud" />
                          <input type="hidden" id="longitud" name="longitud" />
                        </div>
                        <div class="col-12">
                          <label class="form-label">Observaciones</label>
                          <textarea class="form-control" id="descripcion" name="descripcion" rows="3"
                            placeholder="Describe características"></textarea>
                        </div>
                        <div class="col-12">
                          <div class="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                            <button type="button" class="btn btn-secondary" id="cancelCapture">
                              <i class="fas fa-times me-1"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-success">
                              <i class="fas fa-save me-1"></i>Guardar Especie
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Modal Reconociendo especie -->
              <div class="modal fade" id="modalReconociendo" tabindex="-1" aria-labelledby="modalReconociendoLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-body text-center p-4">
                      <i class="fas fa-spinner fa-spin fa-3x mb-3"></i>
                      <h5>Reconociendo especie...</h5>
                      <p class="mb-0">Por favor espera un momento.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script src="../public/js/inicio.js" defer></script>

  <!-- Contenedor para alertas flotantes generales -->
  <div id="alertGlobal" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;"></div>

</body>

<?php include '../includes/footer.html'; ?>

</html>