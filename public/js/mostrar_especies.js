// Agrega este CSS en tu hoja de estilos o en un <style>
/* Para truncar la ubicación en las tarjetas */
const style = document.createElement('style');
style.textContent = `
    .ubicacion-truncada {
        display: inline-block;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }
`;
document.head.appendChild(style);

// DOM Ready

document.addEventListener('DOMContentLoaded', function () {
    cargarEspecies();
    cargarEstadisticas();
    setupFiltros();
});

function cargarEspecies(filtro = 'all') {
    let url = '../apis/obtener_especies.php';
    const params = new URLSearchParams();

    if (filtro === 'recent') {
        params.append('recientes', 'true');
    } else if (filtro !== 'all') {
        params.append('tipo', filtro);
    }

    if (params.toString()) {
        url += '?' + params.toString();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                mostrarEspecies(data.especies);
            } else {
                console.error('Error:', data.message);
                mostrarEstadoVacio();
            }
        })
        .catch(error => {
            console.error('Error al cargar especies:', error);
            mostrarEstadoVacio();
        });
}

function cargarEstadisticas() {
    fetch('../apis/obtener_estadisticas.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                mostrarEstadisticas(data.estadisticas);
            } else {
                console.error('Error al cargar estadísticas:', data.message);
                mostrarErrorEstadisticas();
            }
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
            mostrarErrorEstadisticas();
        });
}

function mostrarEstadisticas(estadisticas) {
    const totalElement = document.getElementById('totalEspecies');
    if (totalElement) totalElement.textContent = estadisticas.total;

    const floraElement = document.getElementById('totalFlora');
    if (floraElement) floraElement.textContent = estadisticas.flora;

    const faunaElement = document.getElementById('totalFauna');
    if (faunaElement) faunaElement.textContent = estadisticas.fauna;

    const esteMesElement = document.getElementById('especiesEsteMes');
    if (esteMesElement) esteMesElement.textContent = estadisticas.este_mes;

    actualizarTarjetasEstadisticas(estadisticas);
}

function actualizarTarjetasEstadisticas(estadisticas) {
    const tarjetas = [
        { id: 'card-total', valor: estadisticas.total },
        { id: 'card-flora', valor: estadisticas.flora },
        { id: 'card-fauna', valor: estadisticas.fauna },
        { id: 'card-mes', valor: estadisticas.este_mes }
    ];

    tarjetas.forEach(tarjeta => {
        const elemento = document.getElementById(tarjeta.id);
        if (elemento) {
            const valorElement = elemento.querySelector('.stat-value, .card-stat-value');
            if (valorElement) valorElement.textContent = tarjeta.valor;
        }
    });
}

function mostrarErrorEstadisticas() {
    const elementos = ['totalEspecies', 'totalFlora', 'totalFauna', 'especiesEsteMes'];
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = '--';
    });
    console.warn('No se pudieron cargar las estadísticas');
}

function mostrarEspecies(especies) {
    const speciesGrid = document.getElementById('speciesGrid');
    const emptyState = document.getElementById('emptyState');
    especiesCargadas = especies;

    if (especies.length === 0) {
        mostrarEstadoVacio();
        return;
    }

    emptyState.classList.add('d-none');
    const itemsDB = speciesGrid.querySelectorAll('.db-item');
    itemsDB.forEach(item => item.remove());

    especies.forEach(especie => {
        const especieHTML = crearTarjetaEspecie(especie);
        speciesGrid.insertAdjacentHTML('beforeend', especieHTML);
    });
}

function crearTarjetaEspecie(especie) {
    const tipoIcon = especie.tipo === 'flora' ? 'fas fa-seedling' : 'fas fa-paw';
    const tipoClass = especie.tipo === 'flora' ? 'type-flora' : 'type-fauna';
    const tipoTexto = especie.tipo.toUpperCase();

    const ubicacionCorta = especie.ubicacion && especie.ubicacion.length > 30
        ? especie.ubicacion.substring(0, 30) + '...'
        : (especie.ubicacion || 'Sin ubicación');

    return `
        <div class="col-lg-4 col-md-6 mb-4 species-item db-item" data-type="${especie.tipo}" data-id="${especie.id_registro}">
            <div class="pokedex-card shadow-sm border rounded-4 overflow-hidden">
                <img src="../public/registros/${especie.imagen}" alt="${especie.nombre_comun}" class="specimen-image">
                <div class="p-3 card-body-fixed">
                    <div>
                        <span class="specimen-type ${tipoClass}">
                            <i class="${tipoIcon} me-1"></i>${tipoTexto}
                        </span>
                        <h5 class="fw-bold mb-2 mt-2">${especie.nombre_comun}</h5>
                        <p class="text-muted mb-2"><em>${especie.nombre_cientifico}</em></p>
                    </div>
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-muted ubicacion-truncada">
                                <i class="fas fa-map-marker-alt me-1"></i>
                                ${ubicacionCorta}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${especie.fecha_formateada}
                            </small>
                        </div>
                        <div class="mt-2 d-flex justify-content-between">
                            <button class="btn btn-sm btn-outline-success" onclick="verDetalles(${especie.id_registro})">
                                <i class="fas fa-eye me-1"></i>Ver Detalles
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="generarPDF(${especie.id_registro})">
                                <i class="fas fa-file-pdf me-1"></i>Generar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function mostrarEstadoVacio() {
    const speciesGrid = document.getElementById('speciesGrid');
    const emptyState = document.getElementById('emptyState');
    const itemsDB = speciesGrid.querySelectorAll('.db-item');
    itemsDB.forEach(item => item.remove());

    const itemsRestantes = speciesGrid.querySelectorAll('.species-item');
    if (itemsRestantes.length === 0) {
        emptyState.classList.remove('d-none');
    }
}

function setupFiltros() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filtro = this.getAttribute('data-filter');
            cargarEspecies(filtro);
        });
    });
}

let especiesCargadas = [];

function verDetalles(idRegistro) {
    const especie = especiesCargadas.find(e => e.id_registro == idRegistro);
    if (especie) {
        mostrarModalDetalles(especie);
    } else {
        console.error('Especie no encontrada en los datos cargados');
        alert('Error al cargar los detalles de la especie');
    }
}

function mostrarModalDetalles(especie) {
    const tipoIcon = especie.tipo === 'flora' ? 'fas fa-seedling' : 'fas fa-paw';
    const tipoClass = especie.tipo === 'flora' ? 'type-flora' : 'type-fauna';
    const tipoTexto = especie.tipo.toUpperCase();

    const modalHTML = `
        <div class="modal fade" id="detallesModal" tabindex="-1" aria-labelledby="detallesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="detallesModalLabel">Detalles de la Especie</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div class="pokedex-card border-0 shadow-none">
                            <img src="../public/registros/${especie.imagen}" alt="${especie.nombre_comun}" 
                                 class="specimen-image" style="height: 300px; object-fit: cover;">
                            <div class="p-4">
                                <span class="specimen-type ${tipoClass}">
                                    <i class="${tipoIcon} me-1"></i>${tipoTexto}
                                </span>
                                <h3 class="fw-bold mb-2 mt-3">${especie.nombre_comun}</h3>
                                <p class="text-muted mb-3 fs-5"><em>${especie.nombre_cientifico}</em></p>
                                <div class="row mb-3">
                                    <div class="col-md-6 mb-2">
                                        <strong><i class="fas fa-map-marker-alt me-2 text-primary"></i>Ubicación:</strong>
                                        <p class="mb-0 ms-4">${especie.ubicacion || 'No especificada'}</p>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <strong><i class="fas fa-calendar me-2 text-primary"></i>Fecha de registro:</strong>
                                        <p class="mb-0 ms-4">${especie.fecha_formateada}</p>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <strong><i class="fas fa-align-left me-2 text-primary"></i>Descripción:</strong>
                                    <p class="mb-0 ms-4 mt-2">${especie.descripcion || 'Sin descripción disponible'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-outline-primary" onclick="generarPDF(${especie.id_registro})">
                            <i class="fas fa-file-pdf me-1"></i>Generar PDF
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modalAnterior = document.getElementById('detallesModal');
    if (modalAnterior) modalAnterior.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('detallesModal'));
    modal.show();

    document.getElementById('detallesModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

async function generarPDF(idRegistro) {
  const especie = especiesCargadas.find(e => e.id_registro == idRegistro);
  if (!especie) return alert('No se pudo generar el PDF');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logoURL = '../public/img/logo.png';
  const especieImgURL = `../public/registros/${especie.imagen}`;

  const logo = new Image();
  logo.src = logoURL;

  logo.onload = () => {
    const especieImg = new Image();
    especieImg.src = especieImgURL;

    especieImg.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Fondo blanco
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Marca de agua logo con opacidad media, centrado
      const watermarkSize = 140;
      const watermarkX = (pageWidth - watermarkSize) / 2;
      const watermarkY = (pageHeight - watermarkSize) / 2;
      doc.setGState(new doc.GState({ opacity: 0.12 }));
      doc.addImage(logo, 'PNG', watermarkX, watermarkY, watermarkSize, watermarkSize);
      doc.setGState(new doc.GState({ opacity: 1 }));

      // Márgenes y tamaños
      const margin = 10;  // menos margen superior para subir todo
      const logoSize = 28;
      const datosFontSize = 13;
      const lineSpacing = 6;

      // Logo a la izquierda, margen 10
      const logoY = margin;
      doc.addImage(logo, 'PNG', margin, logoY, logoSize, logoSize);

      // Datos a la derecha, alineados al margen derecho, misma altura que logo (centrados verticalmente respecto a logo)
      doc.setFontSize(datosFontSize);
      const datos = [
        { etiqueta: 'Fecha', valor: especie.fecha_formateada },
        { etiqueta: 'Tipo', valor: especie.tipo.toUpperCase() },
        { etiqueta: 'ID Registro', valor: especie.id_registro.toString() }
      ];

      const lineHeight = datosFontSize * 0.4;
      let datosY = logoY + logoSize/2 - ( (datos.length * lineHeight) / 2 ) + lineHeight;
      const datosXRight = pageWidth - margin;

      datos.forEach(dato => {
        if (dato.valor === '') {
          doc.setFont("helvetica", "bold");
          const textWidth = doc.getTextWidth(dato.etiqueta);
          const x = datosXRight - textWidth;
          doc.text(dato.etiqueta, x, datosY);
        } else {
          doc.setFont("helvetica", "bold");
          const etiquetaTexto = dato.etiqueta + ': ';
          const etiquetaWidth = doc.getTextWidth(etiquetaTexto);
          const valorWidth = doc.getTextWidth(dato.valor);

          const x = datosXRight - (etiquetaWidth + valorWidth);
          doc.text(etiquetaTexto, x, datosY);
          doc.setFont("helvetica", "normal");
          doc.text(dato.valor, x + etiquetaWidth, datosY);
        }
        datosY += lineHeight;
      });

      // Título centrado un poco más arriba
      const title = 'Ficha de Especie Registrada';
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      const titleY = margin + logoSize + 7;  // se mantiene la distancia del título respecto al logo
      doc.text(title, titleX, titleY);

      // Imagen especie centrada debajo del título
      const maxImgWidth = 170;
      const maxImgHeight = 90;
      let imgWidth = especieImg.width;
      let imgHeight = especieImg.height;

      const widthRatio = maxImgWidth / imgWidth;
      const heightRatio = maxImgHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio, 1);

      imgWidth *= ratio;
      imgHeight *= ratio;

      const imgX = (pageWidth - imgWidth) / 2;
      const imgY = titleY + 10;

      // Marco gris para la imagen
      doc.setDrawColor(150);
      doc.setLineWidth(0.8);
      doc.rect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 'S');

      doc.addImage(especieImg, 'JPEG', imgX, imgY, imgWidth, imgHeight);

      // Datos con etiquetas en negrita y valores normales
      doc.setFontSize(datosFontSize);
      doc.setTextColor(33, 37, 41);

      let y = imgY + imgHeight + 20;
      const labelX = 20;
      const valueX = 75;
      const maxValueWidth = pageWidth - valueX - 20;
      const lineSpacingDetalles = 10;

      function escribirEtiquetaValor(etiqueta, valor) {
        doc.setFont("helvetica", "bold");
        doc.text(`${etiqueta}:`, labelX, y);
        doc.setFont("helvetica", "normal");
        const lineasValor = doc.splitTextToSize(valor, maxValueWidth);
        doc.text(lineasValor, valueX, y);
        y += lineSpacingDetalles * lineasValor.length;
      }

      escribirEtiquetaValor('Nombre común', especie.nombre_comun);
      escribirEtiquetaValor('Nombre científico', especie.nombre_cientifico);
      escribirEtiquetaValor('Ubicación', especie.ubicacion || 'No especificada');
      escribirEtiquetaValor('Descripción', especie.descripcion || 'Sin descripción disponible');

      // Línea divisoria gris justo arriba del footer
      const footerY = pageHeight - 20;
      doc.setDrawColor(200);
      doc.setLineWidth(0.6);
      doc.line(labelX, footerY, pageWidth - labelX, footerY);

      // Footer centrado y discreto
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.setFont("helvetica", "italic");
      const footerText = '© TuApp de Biodiversidad - Documento generado automáticamente';
      const footerWidth = doc.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      doc.text(footerText, footerX, footerY + 10);

      // Guardar PDF
      doc.save(`especie_${especie.id_registro}.pdf`);
    };

    especieImg.onerror = () => {
      alert('No se pudo cargar la imagen de la especie.');
    };
  };

  logo.onerror = () => {
    alert('Error al cargar el logo para el PDF.');
  };
}




function refrescarEspecies() {
    const filtroActivo = document.querySelector('.btn-filter.active');
    const filtro = filtroActivo ? filtroActivo.getAttribute('data-filter') : 'all';
    cargarEspecies(filtro);
    cargarEstadisticas();
}

function refrescarEstadisticas() {
    cargarEstadisticas();
}
