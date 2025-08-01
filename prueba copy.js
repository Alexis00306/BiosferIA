document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "AIzaSyBV9M7KOEjza-_gXT1Q_lxkofnXhQuMYoI"; // Reemplaza con tu API Key Google Vision

  let fotoBlob = null;
  let camStream = null;

  // Elementos
  const startCameraBtn = document.getElementById("startCamera");
  const capturePhotoBtn = document.getElementById("capturePhoto");
  const stopCameraBtn = document.getElementById("stopCamera");
  const cameraPreview = document.getElementById("cameraPreview");

  const formRegistro = document.getElementById("formRegistro");
  const tipoInput = document.getElementById("tipo");
  const nombreComunInput = document.getElementById("nombreComun");
  const nombreCientificoInput = document.getElementById("nombreCientifico");
  const ubicacionInput = document.getElementById("ubicacion");
  const descripcionInput = document.getElementById("descripcion");
  const latitudInput = document.getElementById("latitud");
  const longitudInput = document.getElementById("longitud");

  // Al iniciar, oculta el formulario
  document.getElementById("captureForm").classList.add("d-none");

  // Mostrar / Ocultar modal
  function mostrarModalReconociendo(show) {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalReconociendo'));
    if (show) modal.show();
    else modal.hide();
  }

  // Alertas
  function mostrarAlerta(mensaje, tipo = "info") {
    const iconos = {
      success: '<i class="fas fa-check-circle me-2"></i>',
      danger: '<i class="fas fa-exclamation-circle me-2"></i>',
      warning: '<i class="fas fa-exclamation-triangle me-2"></i>',
      info: '<i class="fas fa-info-circle me-2"></i>',
    };
    const alerta = $(
      `<div class="alert alert-${tipo} alert-dismissible fade show d-flex align-items-center" role="alert">
        ${iconos[tipo] || iconos.info}
        <div>${mensaje}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`
    );
    $("#alertGlobal").append(alerta);
    setTimeout(() => alerta.alert('close'), 5000);
  }

  // Iniciar cámara
  startCameraBtn.addEventListener("click", async () => {
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraPreview.innerHTML = "";
      const video = document.createElement("video");
      video.srcObject = camStream;
      video.autoplay = true;
      video.playsInline = true;
      cameraPreview.appendChild(video);
      capturePhotoBtn.disabled = false;
      stopCameraBtn.disabled = false;
    } catch (e) {
      mostrarAlerta("No se pudo acceder a la cámara: " + e.message, "danger");
    }
  });

  // Apagar cámara
  function apagarCamara() {
    if (camStream) {
      camStream.getTracks().forEach(track => track.stop());
      camStream = null;
    }
    cameraPreview.innerHTML = `
      <div class="text-center">
        <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
        <div class="mt-2">Cámara no iniciada</div>
        <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
      </div>
    `;
    capturePhotoBtn.disabled = true;
    stopCameraBtn.disabled = true;
  }

  stopCameraBtn.addEventListener("click", apagarCamara);

  // Capturar foto
  capturePhotoBtn.addEventListener("click", () => {
    if (!camStream) {
      mostrarAlerta("La cámara no está activa", "warning");
      return;
    }
    mostrarModalReconociendo(true);
    const video = cameraPreview.querySelector("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      fotoBlob = blob;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            latitudInput.value = pos.coords.latitude.toFixed(6);
            longitudInput.value = pos.coords.longitude.toFixed(6);
            ubicacionInput.value = await obtenerUbicacion(pos.coords.latitude, pos.coords.longitude);
            await analizarImagen(blob);
          },
          async () => {
            latitudInput.value = "";
            longitudInput.value = "";
            ubicacionInput.value = "";
            await analizarImagen(blob);
          }
        );
      } else {
        latitudInput.value = "";
        longitudInput.value = "";
        ubicacionInput.value = "";
        await analizarImagen(blob);
      }
    }, "image/jpeg");
  });

  // Obtener ubicación
  async function obtenerUbicacion(lat, lon) {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`);
      const data = await res.json();
      const partes = [];
      if (data.locality) partes.push(data.locality);
      if (data.principalSubdivision) partes.push(data.principalSubdivision);
      if (data.countryName) partes.push(data.countryName);
      return partes.join(", ") || "Ubicación no identificada";
    } catch {
      return "Error al obtener ubicación";
    }
  }

  // Palabras clave para flora y fauna (inglés y español)
  const palabrasClaveFlora = [
    "plant","tree","flower","grass","moss","fungus","leaf","bush","weed","flora","herb","shrub","fungi","algae",
    "planta","árbol","flor","hierba","musgo","hongo","hoja","arbusto","maleza","hongos","algas"
  ];

  const palabrasClaveFauna = [
    "animal","bird","mammal","fish","reptile","amphibian","insect","arachnid","fauna","ave",
    "mamífero","pez","reptil","anfibio","insecto","arácnido","serpent","snake"
  ];

  function determinarTipo(texto) {
    texto = texto.toLowerCase();
    if (palabrasClaveFlora.some(p => texto.includes(p))) return "flora";
    if (palabrasClaveFauna.some(p => texto.includes(p))) return "fauna";
    return null;
  }

  // FUNCIÓN CORREGIDA - Igual que en tu prueba exitosa
  function obtenerNombreComunDesdeExtracto(extract, nombreCientifico) {
    if (!extract) return nombreCientifico || "No disponible";
    
    // Obtener la primera oración (hasta el primer punto)
    const primeraOracion = extract.split(".")[0];

    // Intentar capturar el sujeto antes de expresiones comunes
    let regex = /^(La|El|Los|Las|Un|Una)?\s*([\w\sáéíóúüñ\-]+?),?\s*(también llamada|es una especie de|es un|es una|es el|es la|es los|es las)/i;
    let match = primeraOracion.match(regex);
    if (match && match[2]) {
      return match[2].trim();
    }

    // Si no se detecta patrón, buscar la primera palabra capitalizada que no sea artículo
    const palabras = primeraOracion.split(/\s+/);
    for (let palabra of palabras) {
      if (/^[A-ZÁÉÍÓÚÜÑ]/.test(palabra) && !["La","El","Los","Las","Un","Una"].includes(palabra)) {
        return palabra.replace(/[.,;:()"]/g, "");
      }
    }

    // Si nada, devolver el nombre científico
    return nombreCientifico || "No disponible";
  }

  // Función para determinar tipo desde extracto Wikipedia
  function determinarTipoDesdeExtracto(extract) {
    if (!extract) return null;
    const texto = extract.toLowerCase();

    const floraKeys = [
      "planta","árbol","flor","hierba","musgo","hongo","algas","arbusto","vegetal","flora"
    ];
    const faunaKeys = [
      "animal","ave","mamífero","pez","reptil","anfibio","insecto","serpiente","araña","invertebrado",
      "mariposa","crustáceo","lagarto","rata","ratón","cangrejo","tiburón","perro","gato","lagarto",
      "amphibian","reptile","bird","mammal","fish","insect"
    ];

    for (const f of faunaKeys) {
      if (texto.includes(f)) return "fauna";
    }
    for (const f of floraKeys) {
      if (texto.includes(f)) return "flora";
    }
    return null;
  }

  // Buscar en Wikipedia
  function buscarEnWikipedia(nombre, idioma) {
    return fetch(`https://${idioma}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombre)}`)
      .then(res => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      });
  }

  // Traducir texto - usando la misma API que tu prueba exitosa
  async function traducir(texto) {
    try {
      const textoCorto = texto.length > 500 ? texto.substring(0, 500) : texto;
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoCorto)}&langpair=en|es`);
      const data = await res.json();
      return data.responseData.translatedText;
    } catch (e) {
      return texto;
    }
  }

  // FUNCIÓN CORREGIDA - Procesamiento mejorado como en tu prueba exitosa
  async function procesarInformacionWikipedia(nombreDetectado) {
    try {
      // Primero buscar en español
      let info = await buscarEnWikipedia(nombreDetectado, "es");
      let tipoWikipedia = determinarTipoDesdeExtracto(info.extract);
      
      if (info.extract) {
        // Si hay información en español, usarla directamente
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreDetectado);
        const nombreCientifico = info.titles?.normalized || nombreDetectado;
        const descripcionCorta = info.extract.split(".")[0] + ".";
        
        return {
          nombreComun,
          nombreCientifico,
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          success: true
        };
      }
    } catch (error) {
      console.log("No encontrado en español, buscando en inglés...");
    }

    try {
      // Si no hay información en español, buscar en inglés y traducir
      let info = await buscarEnWikipedia(nombreDetectado, "en");
      
      if (info.extract) {
        // Traducir el extracto
        const descripcionTraducida = await traducir(info.extract);
        const tipoWikipedia = determinarTipoDesdeExtracto(descripcionTraducida);
        
        const nombreComun = obtenerNombreComunDesdeExtracto(descripcionTraducida, nombreDetectado);
        const nombreCientifico = info.titles?.normalized || nombreDetectado;
        const descripcionCorta = descripcionTraducida.split(".")[0] + ".";
        
        return {
          nombreComun,
          nombreCientifico,
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          success: true
        };
      }
    } catch (error) {
      console.log("No encontrado en Wikipedia:", error);
    }

    return { success: false };
  }

  // Analizar imagen y rellenar formulario - LÓGICA CORREGIDA
  async function analizarImagen(blob) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        
        try {
          const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [{
                image: { content: base64Image },
                features: [
                  { type: "WEB_DETECTION", maxResults: 10 },
                  { type: "LABEL_DETECTION", maxResults: 5 }
                ],
              }],
            }),
          });

          const data = await response.json();

          if (data.error) {
            mostrarModalReconociendo(false);
            mostrarAlerta("Error en API: " + data.error.message, "danger");
            resolve();
            return;
          }

          const webEntities = data.responses[0]?.webDetection?.webEntities || [];
          const labels = data.responses[0]?.labelAnnotations || [];

          let nombreDetectado = null;
          let score = 0;

          // Buscar el mejor resultado como en tu prueba exitosa
          if (webEntities.length > 0 && webEntities[0].description) {
            const mejor = webEntities.reduce((a, b) => (a.score || 0) > (b.score || 0) ? a : b);
            nombreDetectado = mejor.description;
            score = ((mejor.score || 0) * 100).toFixed(1);
          } else if (labels.length > 0 && labels[0].description) {
            const mejorLabel = labels[0];
            nombreDetectado = mejorLabel.description;
            score = ((mejorLabel.score || 0) * 100).toFixed(1);
          }

          if (!nombreDetectado) {
            mostrarModalReconociendo(false);
            mostrarAlerta("No se detectó ninguna especie con suficiente certeza", "warning");
            apagarCamara();
            document.getElementById("captureForm").classList.add("d-none");
            resolve();
            return;
          }

          // Determinar tipo inicial
          const todasDescripciones = [
            ...webEntities.map(w => w.description),
            ...labels.map(l => l.description)
          ].filter(Boolean).map(d => d.toLowerCase());

          const tipoInicial = determinarTipo(todasDescripciones.find(desc => determinarTipo(desc) !== null) || "");

          if (!tipoInicial) {
            mostrarModalReconociendo(false);
            mostrarAlerta("No se reconoció flora ni fauna", "warning");
            apagarCamara();
            document.getElementById("captureForm").classList.add("d-none");
            resolve();
            return;
          }

          // Buscar información en Wikipedia usando la lógica corregida
          const infoWiki = await procesarInformacionWikipedia(nombreDetectado);

          if (infoWiki.success) {
            // Usar información de Wikipedia
            const tipoFinal = infoWiki.tipo || tipoInicial;
            
            nombreComunInput.value = infoWiki.nombreComun;
            nombreCientificoInput.value = infoWiki.nombreCientifico;
            descripcionInput.value = infoWiki.descripcion;
            tipoInput.value = tipoFinal;
          } else {
            // Si no se encuentra información en Wikipedia, usar datos básicos
            nombreComunInput.value = nombreDetectado;
            nombreCientificoInput.value = nombreDetectado;
            descripcionInput.value = "";
            tipoInput.value = tipoInicial;
          }

          mostrarModalReconociendo(false);

          // Mostrar imagen capturada
          if (camStream) {
            camStream.getTracks().forEach(track => track.stop());
            camStream = null;
          }
          const img = document.createElement("img");
          img.src = reader.result;
          img.classList.add("img-fluid");
          cameraPreview.innerHTML = "";
          cameraPreview.appendChild(img);

          // Mostrar formulario
          document.getElementById("captureForm").classList.remove("d-none");
          resolve();

        } catch (err) {
          console.error("Error al analizar la imagen:", err);
          mostrarModalReconociendo(false);
          mostrarAlerta("Error al analizar imagen: " + err.message, "danger");
          apagarCamara();
          document.getElementById("captureForm").classList.add("d-none");
          resolve();
        }
      };
      reader.readAsDataURL(blob);
    });
  }

  // Cancelar captura y ocultar formulario
  document.getElementById("cancelCapture").addEventListener("click", () => {
    document.getElementById("captureForm").classList.add("d-none");
    formRegistro.reset();
    fotoBlob = null;
    apagarCamara();
  });

  // Guardar registro
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!fotoBlob) {
      mostrarAlerta("No has capturado una foto.", "warning");
      return;
    }
    if (!tipoInput.value || !nombreComunInput.value || !nombreCientificoInput.value) {
      mostrarAlerta("Completa los campos obligatorios.", "warning");
      return;
    }

    const formData = new FormData(formRegistro);
    formData.append("imagen", fotoBlob, "captura.jpg");

    fetch("../apis/guardar_registro.php", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          refrescarEspecies();
          refrescarEstadisticas();
          mostrarAlerta("Especie registrada correctamente", "success");
          formRegistro.reset();
          document.getElementById("captureForm").classList.add("d-none");
          fotoBlob = null;
          apagarCamara();
        } else {
          mostrarAlerta(data.message || "Error al guardar", "danger");
        }
      })
      .catch(() => {
        mostrarAlerta("Error de conexión con el servidor", "danger");
      });
  });
});

function refrescarEspecies() {
    const filtroActivo = document.querySelector('.btn-filter.active');
    const filtro = filtroActivo ? filtroActivo.getAttribute('data-filter') : 'all';
    cargarEspecies(filtro);
    cargarEstadisticas();
}

function refrescarEstadisticas() {
    cargarEstadisticas();
}