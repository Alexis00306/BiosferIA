<?php
// Incluir verificación de administrador al inicio del archivo
require_once '../admin/verificar_admin.php';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panel de Administrador - Flora y Fauna</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />

    <!-- Tu CSS personalizado -->
    <link href="../public/css/admin.css" rel="stylesheet" />

    <!-- Bootstrap 5 JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body>
    <div class="container main-container">
        <!-- Header del Panel con info del admin -->
        <div class="admin-header">
            <div class="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                    <h1 class="mb-0">
                        <i class="fas fa-cog me-3"></i>
                        Panel de Administrador
                    </h1>
                    <p class="mb-0 mt-2 opacity-75">Gestión de usuarios y registros del sistema</p>
                </div>
                <div class="text-end mt-3 mt-md-0">
                    <small class="opacity-75">Conectado como:</small><br>
                    <strong><?php echo htmlspecialchars($_SESSION['usuario']['nombre']); ?></strong><br>
                    <small><?php echo htmlspecialchars($_SESSION['usuario']['correo']); ?></small><br>
                    <a href="logout.php" class="btn btn-outline-light btn-sm mt-2">
                        <i class="fas fa-sign-out-alt me-1"></i>Cerrar Sesión
                    </a>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
            <div class="col-lg-3 col-md-6 col-6">
                <div class="stats-card">
                    <i class="fas fa-users mb-2" style="font-size: 1.5rem;"></i>
                    <span class="stats-number" id="totalUsuarios">0</span>
                    <small>Total Usuarios</small>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-6">
                <div class="stats-card">
                    <i class="fas fa-seedling mb-2" style="font-size: 1.5rem;"></i>
                    <span class="stats-number" id="totalFlora">0</span>
                    <small>Registros Flora</small>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-6">
                <div class="stats-card">
                    <i class="fas fa-paw mb-2" style="font-size: 1.5rem;"></i>
                    <span class="stats-number" id="totalFauna">0</span>
                    <small>Registros Fauna</small>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-6">
                <div class="stats-card">
                    <i class="fas fa-database mb-2" style="font-size: 1.5rem;"></i>
                    <span class="stats-number" id="totalRegistros">0</span>
                    <small>Total Registros</small>
                </div>
            </div>
        </div>

        <!-- Navegación por pestañas -->
        <ul class="nav nav-tabs" id="adminTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="usuarios-tab" data-bs-toggle="tab" data-bs-target="#usuarios"
                    type="button" role="tab">
                    <i class="fas fa-users me-2"></i>Usuarios
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="registros-tab" data-bs-toggle="tab" data-bs-target="#registros"
                    type="button" role="tab">
                    <i class="fas fa-clipboard-list me-2"></i>Registros
                </button>
            </li>
        </ul>

        <!-- Contenido de las pestañas -->
        <div class="tab-content" id="adminTabsContent">
            <!-- Pestaña Usuarios -->
            <div class="tab-pane fade show active" id="usuarios" role="tabpanel">
                <div class="section-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="mb-0">
                            <i class="fas fa-users me-2"></i>
                            Gestión de Usuarios
                        </h3>
                        <div class="text-white opacity-75">
                            <i class="fas fa-info-circle me-1"></i>
                            Solo lectura, edición y eliminación
                        </div>
                    </div>
                </div>
                <div class="section-content">
                    <!-- Buscador -->
                    <div class="search-container">
                        <input type="text" class="form-control" id="searchUsuarios" placeholder="Buscar usuarios...">
                        <i class="fas fa-search"></i>
                    </div>

                    <!-- Tabla de usuarios para desktop -->
                    <div class="table-container">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th class="hide-md">Apellido</th>
                                    <th>Correo</th>
                                    <th class="hide-lg">Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaUsuarios">
                                <!-- Los datos se cargan dinámicamente -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Cards para móvil -->
                    <div class="mobile-cards" id="mobileUsuarios">
                        <!-- Se generan dinámicamente -->
                    </div>
                </div>
            </div>

            <!-- Pestaña Registros -->
            <div class="tab-pane fade" id="registros" role="tabpanel">
                <div class="section-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="mb-0">
                            <i class="fas fa-clipboard-list me-2"></i>
                            Gestión de Registros
                        </h3>
                        <div class="text-white opacity-75">
                            <i class="fas fa-info-circle me-1"></i>
                            Solo lectura, edición y eliminación
                        </div>
                    </div>
                </div>
                <div class="section-content">
                    <!-- Filtros -->
                    <div class="row mb-3 filter-row">
                        <div class="col-lg-4 col-md-4 col-12">
                            <div class="search-container">
                                <input type="text" class="form-control" id="searchRegistros"
                                    placeholder="Buscar registros...">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-6">
                            <select class="form-select" id="filterTipo">
                                <option value="">Todos los tipos</option>
                                <option value="flora">Flora</option>
                                <option value="fauna">Fauna</option>
                            </select>
                        </div>
                        <div class="col-lg-4 col-md-4 col-6">
                            <select class="form-select" id="filterUsuario">
                                <option value="">Todos los usuarios</option>
                                <!-- Se carga dinámicamente -->
                            </select>
                        </div>
                    </div>

                    <!-- Tabla de registros para desktop -->
                    <div class="table-container">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th class="hide-md">Usuario</th>
                                    <th>Nombre Común</th>
                                    <th class="hide-lg">Nombre Científico</th>
                                    <th>Tipo</th>
                                    <th class="hide-sm">Imagen</th>
                                    <th class="hide-lg">Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tablaRegistros">
                                <!-- Los datos se cargan dinámicamente -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Cards para móvil -->
                    <div class="mobile-cards" id="mobileRegistros">
                        <!-- Se generan dinámicamente -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Usuario -->
    <div class="modal fade" id="modalUsuario" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalUsuarioTitle">
                        <i class="fas fa-edit me-2"></i>Editar Usuario
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formUsuario">
                        <input type="hidden" id="usuarioId" name="id">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="usuarioNombre" name="nombre" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Apellido</label>
                                <input type="text" class="form-control" id="usuarioApellido" name="apellido" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" class="form-control" id="usuarioCorreo" name="correo" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nueva Contraseña</label>
                            <input type="password" class="form-control" id="usuarioPassword" name="password">
                            <small class="text-muted">Dejar vacío para mantener la actual</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" id="btnGuardarUsuario">
                        <i class="fas fa-save me-1"></i>Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Registro -->
    <div class="modal fade" id="modalRegistro" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalRegistroTitle">
                        <i class="fas fa-edit me-2"></i>Editar Registro
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formRegistro" enctype="multipart/form-data">
                        <input type="hidden" id="registroId" name="id_registro">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Usuario</label>
                                <select class="form-select" id="registroUsuario" name="id_usuario" required>
                                    <option value="">Seleccionar usuario...</option>
                                    <!-- Se carga dinámicamente -->
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tipo</label>
                                <select class="form-select" id="registroTipo" name="tipo" required>
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="flora">Flora</option>
                                    <option value="fauna">Fauna</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre Común</label>
                                <input type="text" class="form-control" id="registroNombreComun" name="nombre_comun"
                                    required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre Científico</label>
                                <input type="text" class="form-control" id="registroNombreCientifico"
                                    name="nombre_cientifico">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ubicación</label>
                            <input type="text" class="form-control" id="registroUbicacion" name="ubicacion">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" id="registroDescripcion" name="descripcion"
                                rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cambiar Imagen</label>
                            <input type="file" class="form-control" id="registroImagen" name="imagen" accept="image/*">
                            <small class="text-muted">Dejar vacío para mantener la imagen actual</small>
                            <div id="imagenPreview" class="mt-2"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" id="btnGuardarRegistro">
                        <i class="fas fa-save me-1"></i>Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de confirmación -->
    <div class="modal fade" id="modalConfirmar" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle me-2"></i>Confirmar Eliminación
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p id="mensajeConfirmacion">¿Estás seguro de que deseas eliminar este elemento?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarEliminar">
                        <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Contenedor para alertas flotantes generales -->
    <div id="alertContainer" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;"></div>

    <!-- Tu JavaScript personalizado -->
    <script src="../public/js/admin.js"></script>
</body>

</html>