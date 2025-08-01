// JavaScript Panel de Administrador

// Variables globales
let currentAction = '';
let currentId = 0;
let currentTable = '';

// Inicializar cuando se carga la página
$(document).ready(function () {
    cargarEstadisticas();
    cargarUsuarios();
    cargarRegistros();
    cargarSelectUsuarios();

    // Event listeners para búsqueda y filtros
    $('#searchUsuarios').on('keyup', function () {
        filtrarTabla('usuarios', $(this).val());
    });

    $('#searchRegistros').on('keyup', function () {
        filtrarRegistros();
    });

    $('#filterTipo, #filterUsuario').on('change', function () {
        filtrarRegistros();
    });

    // Event listeners para pestañas
    $('#registros-tab').on('click', function () {
        cargarRegistros();
    });

    // Event listener para vista previa de imagen
    $('#registroImagen').on('change', function () {
        mostrarVistaPrevia(this);
    });
});

// Función para mostrar alertas
function mostrarAlerta(tipo, mensaje) {
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    $('#alertContainer').html(alerta);

    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

// Cargar estadísticas
function cargarEstadisticas() {
    $.ajax({
        url: '../admin/obtener_estadisticas.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                $('#totalUsuarios').text(response.data.usuarios);
                $('#totalFlora').text(response.data.flora);
                $('#totalFauna').text(response.data.fauna);
                $('#totalRegistros').text(response.data.total_registros);
            }
        },
        error: function () {
            console.error('Error al cargar estadísticas');
        }
    });
}

// FUNCIONES PARA USUARIOS
function cargarUsuarios() {
    $.ajax({
        url: '../admin/obtener_usuarios.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                let html = '';
                let mobileHtml = '';
                
                response.data.forEach(usuario => {
                    // HTML para tabla desktop
                    html += `
                <tr>
                  <td>${usuario.id}</td>
                  <td>${usuario.nombre}</td>
                  <td class="hide-md">${usuario.apellido}</td>
                  <td>${usuario.correo}</td>
                  <td class="hide-lg">${formatearFecha(usuario.fecha_registro)}</td>
                  <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarUsuario(${usuario.id})">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('usuario', ${usuario.id}, '${usuario.nombre} ${usuario.apellido}')">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;

                    // HTML para cards móviles
                    mobileHtml += `
                <div class="mobile-card">
                    <div class="card-header">
                        <i class="fas fa-user me-2"></i>
                        Usuario #${usuario.id}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${usuario.nombre} ${usuario.apellido}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Correo:</span>
                        <span class="info-value">${usuario.correo}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Registro:</span>
                        <span class="info-value">${formatearFecha(usuario.fecha_registro)}</span>
                    </div>
                    <div class="actions">
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})">
                            <i class="fas fa-edit me-1"></i>Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('usuario', ${usuario.id}, '${usuario.nombre} ${usuario.apellido}')">
                            <i class="fas fa-trash me-1"></i>Eliminar
                        </button>
                    </div>
                </div>
              `;
                });
                
                $('#tablaUsuarios').html(html);
                $('#mobileUsuarios').html(mobileHtml);
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al cargar usuarios');
        }
    });
}

function cargarSelectUsuarios() {
    $.ajax({
        url: '../admin/obtener_usuarios.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                let options = '<option value="">Seleccionar usuario...</option>';
                let filterOptions = '<option value="">Todos los usuarios</option>';

                response.data.forEach(usuario => {
                    options += `<option value="${usuario.id}">${usuario.nombre} ${usuario.apellido}</option>`;
                    filterOptions += `<option value="${usuario.id}">${usuario.nombre} ${usuario.apellido}</option>`;
                });

                $('#registroUsuario').html(options);
                $('#filterUsuario').html(filterOptions);
            }
        }
    });
}

function editarUsuario(id) {
    $.ajax({
        url: '../admin/obtener_usuario.php',
        method: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                const usuario = response.data;
                $('#usuarioId').val(usuario.id);
                $('#usuarioNombre').val(usuario.nombre);
                $('#usuarioApellido').val(usuario.apellido);
                $('#usuarioCorreo').val(usuario.correo);
                $('#usuarioPassword').val('');
                $('#modalUsuarioTitle').html('<i class="fas fa-edit me-2"></i>Editar Usuario');
                $('#modalUsuario').modal('show');
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al cargar datos del usuario');
        }
    });
}

$('#btnGuardarUsuario').click(function () {
    const formData = new FormData($('#formUsuario')[0]);

    // Solo permitir actualización, no creación
    if (!$('#usuarioId').val()) {
        mostrarAlerta('danger', 'Error: No se puede crear usuarios desde el panel de administrador');
        return;
    }

    $.ajax({
        url: '../admin/actualizar_usuario.php',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                mostrarAlerta('success', response.message);
                $('#modalUsuario').modal('hide');
                cargarUsuarios();
                cargarSelectUsuarios();
                cargarEstadisticas();
            } else {
                mostrarAlerta('danger', response.message);
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al procesar la solicitud');
        }
    });
});

// FUNCIONES PARA REGISTROS
function cargarRegistros() {
    $.ajax({
        url: '../admin/obtener_registros.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                let html = '';
                let mobileHtml = '';
                
                response.data.forEach(registro => {
                    const imagen = registro.imagen ?
                        `<img src="../public/registros/${registro.imagen}" class="image-preview" alt="Imagen">` :
                        '<span class="text-muted">Sin imagen</span>';

                    // HTML para tabla desktop
                    html += `
                <tr>
                  <td>${registro.id_registro}</td>
                  <td class="hide-md">${registro.usuario_nombre} ${registro.usuario_apellido}</td>
                  <td>${registro.nombre_comun}</td>
                  <td class="hide-lg">${registro.nombre_cientifico || '-'}</td>
                  <td>
                    <span class="badge bg-${registro.tipo === 'flora' ? 'success' : 'info'}">
                      <i class="fas fa-${registro.tipo === 'flora' ? 'seedling' : 'paw'} me-1"></i>
                      ${registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
                    </span>
                  </td>
                  <td class="hide-sm">${imagen}</td>
                  <td class="hide-lg">${formatearFecha(registro.fecha_registro)}</td>
                  <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="editarRegistro(${registro.id_registro})">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('registro', ${registro.id_registro}, '${registro.nombre_comun}')">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;

                    // HTML para cards móviles
                    mobileHtml += `
                <div class="mobile-card">
                    <div class="card-header">
                        <i class="fas fa-clipboard-list me-2"></i>
                        Registro #${registro.id_registro}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Usuario:</span>
                        <span class="info-value">${registro.usuario_nombre} ${registro.usuario_apellido}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${registro.nombre_comun}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Científico:</span>
                        <span class="info-value">${registro.nombre_cientifico || '-'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Tipo:</span>
                        <span class="info-value">
                            <span class="badge bg-${registro.tipo === 'flora' ? 'success' : 'info'}">
                                <i class="fas fa-${registro.tipo === 'flora' ? 'seedling' : 'paw'} me-1"></i>
                                ${registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
                            </span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Imagen:</span>
                        <span class="info-value">${imagen}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Fecha:</span>
                        <span class="info-value">${formatearFecha(registro.fecha_registro)}</span>
                    </div>
                    <div class="actions">
                        <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id_registro})">
                            <i class="fas fa-edit me-1"></i>Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('registro', ${registro.id_registro}, '${registro.nombre_comun}')">
                            <i class="fas fa-trash me-1"></i>Eliminar
                        </button>
                    </div>
                </div>
              `;
                });
                
                $('#tablaRegistros').html(html);
                $('#mobileRegistros').html(mobileHtml);
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al cargar registros');
        }
    });
}

function editarRegistro(id) {
    $.ajax({
        url: '../admin/obtener_registro.php',
        method: 'POST',
        data: { id: id },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                const registro = response.data;
                $('#registroId').val(registro.id_registro);
                $('#registroUsuario').val(registro.id_usuario);
                $('#registroTipo').val(registro.tipo);
                $('#registroNombreComun').val(registro.nombre_comun);
                $('#registroNombreCientifico').val(registro.nombre_cientifico);
                $('#registroUbicacion').val(registro.ubicacion);
                $('#registroDescripcion').val(registro.descripcion);

                // Mostrar imagen actual si existe
                if (registro.imagen) {
                    $('#imagenPreview').html(`
                <div class="mt-2">
                  <label class="form-label">Imagen actual:</label><br>
                  <img src="../public/registros/${registro.imagen}" class="image-preview" alt="Imagen actual">
                </div>
              `);
                }

                $('#modalRegistroTitle').html('<i class="fas fa-edit me-2"></i>Editar Registro');
                $('#modalRegistro').modal('show');
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al cargar datos del registro');
        }
    });
}

$('#btnGuardarRegistro').click(function () {
    const formData = new FormData($('#formRegistro')[0]);

    // Solo permitir actualización, no creación
    if (!$('#registroId').val()) {
        mostrarAlerta('danger', 'Error: No se puede crear registros desde el panel de administrador');
        return;
    }

    $.ajax({
        url: '../admin/actualizar_registro.php',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            if (response.status === 'ok') {
                mostrarAlerta('success', response.message);
                $('#modalRegistro').modal('hide');
                cargarRegistros();
                cargarEstadisticas();
            } else {
                mostrarAlerta('danger', response.message);
            }
        },
        error: function () {
            mostrarAlerta('danger', 'Error al procesar la solicitud');
        }
    });
});

// FUNCIONES GENERALES
function confirmarEliminar(tipo, id, nombre) {
    currentAction = 'eliminar';
    currentId = id;
    currentTable = tipo;

    const mensaje = `¿Estás seguro de que deseas eliminar ${tipo === 'usuario' ? 'el usuario' : 'el registro'} "${nombre}"?`;
    $('#mensajeConfirmacion').text(mensaje);
    $('#modalConfirmar').modal('show');
}

$('#btnConfirmarEliminar').click(function () {
    if (currentAction === 'eliminar') {
        const url = currentTable === 'usuario' ? '../admin/eliminar_usuario.php' : '../admin/eliminar_registro.php';
        const data = currentTable === 'usuario' ? { id: currentId } : { id_registro: currentId };

        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.status === 'ok') {
                    mostrarAlerta('success', response.message);
                    $('#modalConfirmar').modal('hide');

                    if (currentTable === 'usuario') {
                        cargarUsuarios();
                        cargarSelectUsuarios();
                    } else {
                        cargarRegistros();
                    }
                    cargarEstadisticas();
                } else {
                    mostrarAlerta('danger', response.message);
                }
            },
            error: function () {
                mostrarAlerta('danger', 'Error al eliminar');
            }
        });
    }
});

// Función para filtrar tabla de usuarios
function filtrarTabla(tabla, termino) {
    // Filtrar tabla desktop
    const filas = $(`#tabla${tabla.charAt(0).toUpperCase() + tabla.slice(1)} tr`);
    filas.each(function () {
        const textoFila = $(this).text().toLowerCase();
        if (textoFila.includes(termino.toLowerCase())) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Filtrar cards móviles para usuarios
    if (tabla === 'usuarios') {
        $('#mobileUsuarios .mobile-card').each(function () {
            const textoCard = $(this).text().toLowerCase();
            if (textoCard.includes(termino.toLowerCase())) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

// Función para filtrar registros con múltiples criterios
function filtrarRegistros() {
    const termino = $('#searchRegistros').val().toLowerCase();
    const tipo = $('#filterTipo').val();
    const usuario = $('#filterUsuario').val();

    // Filtrar tabla desktop
    $('#tablaRegistros tr').each(function () {
        const fila = $(this);
        const textoFila = fila.text().toLowerCase();
        const tipoFila = fila.find('td:eq(4)').text().toLowerCase();

        let mostrar = true;

        if (termino && !textoFila.includes(termino)) {
            mostrar = false;
        }

        if (tipo && !tipoFila.includes(tipo)) {
            mostrar = false;
        }

        if (mostrar) {
            fila.show();
        } else {
            fila.hide();
        }
    });

    // Filtrar cards móviles
    $('#mobileRegistros .mobile-card').each(function () {
        const card = $(this);
        const textoCard = card.text().toLowerCase();
        const tipoCard = card.find('.badge').text().toLowerCase();

        let mostrar = true;

        if (termino && !textoCard.includes(termino)) {
            mostrar = false;
        }

        if (tipo && !tipoCard.includes(tipo)) {
            mostrar = false;
        }

        if (mostrar) {
            card.show();
        } else {
            card.hide();
        }
    });
}

// Función para mostrar vista previa de imagen
function mostrarVistaPrevia(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#imagenPreview').html(`
            <div class="mt-2">
              <label class="form-label">Vista previa:</label><br>
              <img src="${e.target.result}" class="image-preview" alt="Vista previa">
            </div>
          `);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Función para formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Limpiar formularios al cerrar modales
$('#modalUsuario').on('hidden.bs.modal', function () {
    $('#formUsuario')[0].reset();
    $('#modalUsuarioTitle').html('<i class="fas fa-edit me-2"></i>Editar Usuario');
});

$('#modalRegistro').on('hidden.bs.modal', function () {
    $('#formRegistro')[0].reset();
    $('#imagenPreview').html('');
    $('#modalRegistroTitle').html('<i class="fas fa-edit me-2"></i>Editar Registro');
});