document.addEventListener("DOMContentLoaded", () => {
  // Reemplaza con tu API Key de iNaturalist (dura 24 horas)
  const INATURALIST_API_KEY = "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjo5NjA4MDgwLCJleHAiOjE3NTQ0MzA2NTd9.3-9V0_tZUHS3qovEl5_K2GAX87jgAoXdhAyWe25nPCIITf2IxlAYwhlvgRya8sUzjJijJqJBiTej9IDguk5Qpg";

  let fotoBlob = null;
  let camStream = null;
  let camaraActual = 'user'; // 'user' para frontal, 'environment' para trasera
  let dispositivosCamera = [];
  let videoElement = null;

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

  // Detectar si es dispositivo móvil
  function esDispositivoMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
  }

  // Configurar cámara inicial según dispositivo
  function configurarCamaraInicial() {
    camaraActual = esDispositivoMovil() ? 'environment' : 'user';
  }

  // Crear botón de alternar cámara
  function crearBotonAlternarCamera() {
    if (esDispositivoMovil() && !document.getElementById('toggleCameraBtn')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'toggleCameraBtn';
      toggleBtn.className = 'btn btn-camera';
      toggleBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Voltear';
      toggleBtn.disabled = true;
      toggleBtn.style.display = 'none';
      
      // Insertar después del botón de capturar
      capturePhotoBtn.parentNode.insertBefore(toggleBtn, capturePhotoBtn.nextSibling);
      
      toggleBtn.addEventListener('click', alternarCamara);
    }
  }

  // Enumerar dispositivos de cámara
  async function enumerarCamaras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      dispositivosCamera = devices.filter(device => device.kind === 'videoinput');
      console.log('Cámaras disponibles:', dispositivosCamera.length);
      return dispositivosCamera.length;
    } catch (error) {
      console.log('Error al enumerar cámaras:', error);
      return 0;
    }
  }

  // Alternar entre cámaras
  async function alternarCamara() {
    if (!camStream) return;
    
    // Cambiar a la otra cámara
    camaraActual = camaraActual === 'user' ? 'environment' : 'user';
    
    // Detener stream actual
    camStream.getTracks().forEach(track => track.stop());
    
    // Iniciar con nueva cámara
    try {
      await iniciarCamara();
    } catch (error) {
      console.log('Error al alternar cámara:', error);
      mostrarAlerta("No se pudo cambiar de cámara", "warning");
    }
  }

  // Función separada para iniciar cámara con mejor manejo de errores
  async function iniciarCamara() {
    try {
      // Detener stream anterior si existe
      if (camStream) {
        camStream.getTracks().forEach(track => track.stop());
      }

      // Configuraciones de video más compatibles con móviles
      const constraints = {
        video: {
          facingMode: camaraActual,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      console.log('Solicitando cámara con constraints:', constraints);
      
      camStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Limpiar preview anterior
      cameraPreview.innerHTML = "";
      
      // Crear elemento video
      videoElement = document.createElement("video");
      videoElement.srcObject = camStream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true; // Importante para móviles
      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "cover";
      
      // Manejar eventos del video
      videoElement.onloadedmetadata = () => {
        console.log('Video metadata cargada');
        videoElement.play().catch(e => {
          console.log('Error al reproducir video:', e);
          mostrarAlerta("Error al iniciar la cámara", "danger");
        });
      };

      cameraPreview.appendChild(videoElement);
      
      // Habilitar botones
      capturePhotoBtn.disabled = false;
      stopCameraBtn.disabled = false;
      startCameraBtn.disabled = true;
      
      // Mostrar botón de alternar en móviles si hay múltiples cámaras
      const toggleBtn = document.getElementById('toggleCameraBtn');
      if (toggleBtn && dispositivosCamera.length > 1) {
        toggleBtn.style.display = 'inline-block';
        toggleBtn.disabled = false;
      }
      
      console.log('Cámara iniciada exitosamente');
      
    } catch (error) {
      console.error('Error detallado al acceder a la cámara:', error);
      
      let mensajeError = "No se pudo acceder a la cámara";
      
      if (error.name === 'NotAllowedError') {
        mensajeError = "Permisos de cámara denegados. Por favor, permite el acceso en la configuración.";
      } else if (error.name === 'NotFoundError') {
        mensajeError = "No se encontró ninguna cámara en el dispositivo.";
      } else if (error.name === 'NotReadableError') {
        mensajeError = "La cámara está siendo usada por otra aplicación.";
      } else if (error.name === 'OverconstrainedError') {
        mensajeError = "Las configuraciones de cámara no son compatibles.";
      }
      
      mostrarAlerta(mensajeError, "danger");
      apagarCamara();
    }
  }

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

  // Verificar permisos de cámara
  async function verificarPermisosCamara() {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      console.log('Estado de permisos de cámara:', result.state);
      return result.state === 'granted';
    } catch (error) {
      console.log('No se pudo verificar permisos:', error);
      return null; // No disponible en todos los navegadores
    }
  }

  // Inicializar cámara y dispositivos
  async function inicializar() {
    configurarCamaraInicial();
    
    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      mostrarAlerta("Tu navegador no soporta acceso a la cámara", "danger");
      return;
    }
    
    await enumerarCamaras();
    crearBotonAlternarCamera();
    
    // Verificar permisos
    const tienePermisos = await verificarPermisosCamara();
    if (tienePermisos === false) {
      mostrarAlerta("Se necesitan permisos de cámara para continuar", "warning");
    }
  }

  // Event listener para iniciar cámara
  startCameraBtn.addEventListener("click", async () => {
    startCameraBtn.disabled = true;
    startCameraBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando...';
    
    await iniciarCamara();
    
    // Restaurar botón si hay error
    if (!camStream) {
      startCameraBtn.disabled = false;
      startCameraBtn.innerHTML = '<i class="fas fa-video me-2"></i><span class="d-none d-sm-inline">Iniciar </span>Cámara';
    }
  });

  // Apagar cámara
  function apagarCamara() {
    if (camStream) {
      camStream.getTracks().forEach(track => track.stop());
      camStream = null;
    }
    
    if (videoElement) {
      videoElement.srcObject = null;
      videoElement = null;
    }
    
    cameraPreview.innerHTML = `
      <div class="text-center">
        <i class="fas fa-camera" style="font-size: 3rem; color: #666;"></i>
        <div class="mt-2">Cámara no iniciada</div>
        <small class="text-muted">Presiona "Iniciar Cámara" para comenzar</small>
      </div>
    `;
    
    // Restablecer estado de botones
    capturePhotoBtn.disabled = true;
    stopCameraBtn.disabled = true;
    startCameraBtn.disabled = false;
    startCameraBtn.innerHTML = '<i class="fas fa-video me-2"></i><span class="d-none d-sm-inline">Iniciar </span>Cámara';
    
    // Ocultar botón de alternar
    const toggleBtn = document.getElementById('toggleCameraBtn');
    if (toggleBtn) {
      toggleBtn.style.display = 'none';
      toggleBtn.disabled = true;
    }
  }

  stopCameraBtn.addEventListener("click", apagarCamara);

  // Capturar foto - MEJORADO para móviles
  capturePhotoBtn.addEventListener("click", async () => {
    if (!camStream || !videoElement) {
      mostrarAlerta("La cámara no está activa", "warning");
      return;
    }

    // Verificar que el video esté reproduciendo
    if (videoElement.readyState < 2) {
      mostrarAlerta("Esperando que la cámara esté lista...", "info");
      return;
    }

    mostrarModalReconociendo(true);
    
    try {
      const canvas = document.createElement("canvas");
      
      // USAR DIMENSIONES DEL CONTENEDOR, NO DEL VIDEO ORIGINAL
      const containerWidth = cameraPreview.clientWidth;
      const containerHeight = cameraPreview.clientHeight;
      
      console.log('📐 Dimensiones del contenedor:', containerWidth, 'x', containerHeight);
      console.log('📐 Dimensiones del video:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      
      // Configurar canvas con las dimensiones del contenedor
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      const ctx = canvas.getContext("2d");
      
      // Calcular cómo está escalado y centrado el video dentro del contenedor
      const videoAspect = videoElement.videoWidth / videoElement.videoHeight;
      const containerAspect = containerWidth / containerHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (videoAspect > containerAspect) {
        // Video es más ancho, se ajusta por altura
        drawHeight = containerHeight;
        drawWidth = drawHeight * videoAspect;
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Video es más alto, se ajusta por ancho
        drawWidth = containerWidth;
        drawHeight = drawWidth / videoAspect;
        offsetX = 0;
        offsetY = (containerHeight - drawHeight) / 2;
      }
      
      // Dibujar el video exactamente como se ve en el contenedor
      ctx.drawImage(videoElement, offsetX, offsetY, drawWidth, drawHeight);
      
      console.log('📷 Captura con dimensiones:', canvas.width, 'x', canvas.height);
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          mostrarModalReconociendo(false);
          mostrarAlerta("Error al capturar la imagen", "danger");
          return;
        }
        
        fotoBlob = blob;
        console.log('Foto capturada, tamaño:', blob.size);
        
        // OBTENER UBICACIÓN MEJORADO - SIEMPRE INTENTAR
        try {
          console.log('🗺️ Intentando obtener ubicación...');
          const position = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('Geolocalización no disponible'));
              return;
            }
            
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { 
                timeout: 15000, // 15 segundos
                enableHighAccuracy: false, // Más rápido
                maximumAge: 300000 // Cache de 5 minutos
              }
            );
          });
          
          // Si se obtuvo la ubicación exitosamente
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);
          
          latitudInput.value = lat;
          longitudInput.value = lon;
          
          console.log('✅ Coordenadas obtenidas:', lat, lon);
          
          try {
            const ubicacionTexto = await obtenerUbicacion(position.coords.latitude, position.coords.longitude);
            ubicacionInput.value = ubicacionTexto;
            console.log('✅ Ubicación obtenida:', ubicacionTexto);
          } catch (ubicError) {
            console.log('❌ Error al obtener nombre de ubicación:', ubicError);
            ubicacionInput.value = `${lat}, ${lon}`;
          }
          
        } catch (geoError) {
          console.log('❌ Error de geolocalización:', geoError);
          latitudInput.value = "";
          longitudInput.value = "";
          ubicacionInput.value = "";
          
          // Mostrar mensaje específico según el error
          if (geoError.code === 1) {
            console.log('Permisos de ubicación denegados');
          } else if (geoError.code === 2) {
            console.log('Posición no disponible');
          } else if (geoError.code === 3) {
            console.log('Timeout de ubicación');
          }
        }
        
        // CONTINUAR CON ANÁLISIS DE IMAGEN
        await analizarImagen(blob);
      }, "image/jpeg", 0.8);
      
    } catch (error) {
      console.error('Error al capturar foto:', error);
      mostrarModalReconociendo(false);
      mostrarAlerta("Error al capturar la foto", "danger");
    }
  });

  // Obtener ubicación MEJORADA
  async function obtenerUbicacion(lat, lon) {
    try {
      console.log(`🌍 Obteniendo ubicación para: ${lat}, ${lon}`);
      
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📍 Datos de ubicación:', data);
      
      const partes = [];
      
      // Construir ubicación en orden jerárquico
      if (data.locality) partes.push(data.locality);
      if (data.city && data.city !== data.locality) partes.push(data.city);
      if (data.principalSubdivision) partes.push(data.principalSubdivision);
      if (data.countryName) partes.push(data.countryName);
      
      const ubicacionFinal = partes.length > 0 ? partes.join(", ") : "Ubicación no identificada";
      console.log('✅ Ubicación final:', ubicacionFinal);
      
      return ubicacionFinal;
      
    } catch (error) {
      console.log('❌ Error al obtener ubicación:', error);
      
      // Fallback: intentar con otra API
      try {
        console.log('🔄 Intentando con API alternativa...');
        const res2 = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`);
        
        if (res2.ok) {
          const data2 = await res2.json();
          const partes2 = [];
          
          if (data2.address) {
            if (data2.address.city) partes2.push(data2.address.city);
            if (data2.address.state) partes2.push(data2.address.state);
            if (data2.address.country) partes2.push(data2.address.country);
          }
          
          if (partes2.length > 0) {
            console.log('✅ Ubicación obtenida con API alternativa:', partes2.join(", "));
            return partes2.join(", ");
          }
        }
      } catch (error2) {
        console.log('❌ API alternativa también falló:', error2);
      }
      
      return "Error al obtener ubicación";
    }
  }

  // NUEVA FUNCIÓN: Función para capitalizar primera letra
  function capitalizarPrimeraLetra(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  // NUEVA FUNCIÓN: Determinar tipo taxonómico
  function getTaxonomyType(iconic) {
    if (iconic === "Plantae") {
      return "flora";
    } else if (iconic === "Fungi") {
      return "flora"; // Los hongos se clasifican como flora en tu sistema
    } else if (
      iconic === "Animalia" ||
      iconic === "Aves" ||
      iconic === "Insecta" ||
      iconic === "Mammalia" ||
      iconic === "Reptilia" ||
      iconic === "Amphibia" ||
      iconic === "Actinopterygii" ||
      iconic === "Arachnida" ||
      iconic === "Mollusca"
    ) {
      return "fauna";
    }
    return null;
  }

  // NUEVA FUNCIÓN: Obtener nombre común en español
  function getSpanishName(specie) {
    // Buscar nombres en español en las traducciones
    if (specie.names && specie.names.length > 0) {
      // Buscar específicamente nombres en español
      const spanishNames = specie.names.filter(
        (name) =>
          name.locale === "es" ||
          name.locale === "es-MX" ||
          name.locale === "es-ES"
      );

      if (spanishNames.length > 0) {
        return spanishNames[0].name;
      }

      // Si no hay español, buscar nombres comunes en general
      const commonNames = specie.names.filter(
        (name) => name.locale === "en"
      );
      if (commonNames.length > 0) {
        return translateCommonName(commonNames[0].name);
      }
    }

    // Fallback al preferred_common_name
    if (specie.preferred_common_name) {
      return translateCommonName(specie.preferred_common_name);
    }

    // Último recurso: crear nombre descriptivo
    return createDescriptiveName(specie);
  }

  // NUEVA FUNCIÓN: Traducir nombres comunes básicos
  function translateCommonName(englishName) {
    const nameTranslations = {
      // Plantas
      Oak: "Roble",
      Pine: "Pino",
      Rose: "Rosa",
      Sunflower: "Girasol",
      Daisy: "Margarita",
      Lily: "Lirio",
      Tulip: "Tulipán",
      Cactus: "Cactus",
      Aloe: "Aloe",
      Fern: "Helecho",
      Moss: "Musgo",
      Grass: "Hierba",
      Tree: "Árbol",
      Shrub: "Arbusto",
      Herb: "Hierba",

      // Animales
      Dog: "Perro",
      Cat: "Gato",
      Bird: "Ave",
      Butterfly: "Mariposa",
      Bee: "Abeja",
      Ant: "Hormiga",
      Spider: "Araña",
      Beetle: "Escarabajo",
      Fly: "Mosca",
      Moth: "Polilla",
      Dragonfly: "Libélula",
      Ladybug: "Mariquita",
      Grasshopper: "Saltamontes",
      Cricket: "Grillo",
      Frog: "Rana",
      Lizard: "Lagarto",
      Snake: "Serpiente",
      Fish: "Pez",
      Mouse: "Ratón",
      Rabbit: "Conejo",
    };

    // Buscar traducción exacta
    for (const [english, spanish] of Object.entries(nameTranslations)) {
      if (englishName.toLowerCase().includes(english.toLowerCase())) {
        return englishName.replace(
          new RegExp(english, "gi"),
          spanish
        );
      }
    }

    // Si no encuentra traducción, devolver el original
    return englishName;
  }

  // NUEVA FUNCIÓN: Crear nombre descriptivo basado en taxonomía
  function createDescriptiveName(specie) {
    const iconic = specie.iconic_taxon_name;

    switch (iconic) {
      case "Plantae":
        return "Planta no identificada";
      case "Animalia":
        return "Animal no identificado";
      case "Aves":
        return "Ave no identificada";
      case "Insecta":
        return "Insecto no identificado";
      case "Fungi":
        return "Hongo no identificado";
      case "Mammalia":
        return "Mamífero no identificado";
      case "Reptilia":
        return "Reptil no identificado";
      case "Amphibia":
        return "Anfibio no identificado";
      default:
        return "Especie no identificada";
    }
  }

  // NUEVA FUNCIÓN: Obtener descripción original hasta el primer punto (SIN HTML)
  function getOriginalDescription(specie) {
    // Primero intentar obtener la descripción de Wikipedia
    if (specie.wikipedia_summary && specie.wikipedia_summary.length > 0) {
      // LIMPIAR ETIQUETAS HTML
      let cleanText = specie.wikipedia_summary
        .replace(/<[^>]*>/g, '') // Quitar todas las etiquetas HTML
        .replace(/&nbsp;/g, ' ') // Reemplazar espacios no-break
        .replace(/&amp;/g, '&')  // Reemplazar &amp;
        .replace(/&lt;/g, '<')   // Reemplazar &lt;
        .replace(/&gt;/g, '>')   // Reemplazar &gt;
        .replace(/&quot;/g, '"') // Reemplazar &quot;
        .replace(/&#39;/g, "'")  // Reemplazar &#39;
        .trim();

      // Buscar el primer punto seguido de espacio o final de cadena
      const firstSentence = cleanText.match(/^[^.]*\./);
      if (firstSentence) {
        return firstSentence[0].trim();
      }
      // Si no encuentra punto, tomar hasta los primeros 200 caracteres
      return cleanText.substring(0, 200) + "...";
    }

    // Si no hay descripción de Wikipedia, usar la descripción básica
    return getBasicSpanishDescription(specie);
  }

  // NUEVA FUNCIÓN: Descripción básica en español
  function getBasicSpanishDescription(specie) {
    const iconic = specie.iconic_taxon_name;
    const scientificName = specie.name;

    const descriptions = {
      Plantae: `${scientificName} es una especie de planta. Las plantas son organismos fotosintéticos fundamentales para los ecosistemas terrestres.`,
      Aves: `${scientificName} es una especie de ave. Las aves son vertebrados con plumas que desempeñan roles importantes en la dispersión de semillas y control de insectos.`,
      Insecta: `${scientificName} es una especie de insecto. Los insectos son el grupo más diverso de animales y son cruciales para la polinización y descomposición.`,
      Mammalia: `${scientificName} es una especie de mamífero. Los mamíferos son vertebrados de sangre caliente que amamantan a sus crías.`,
      Fungi: `${scientificName} es una especie de hongo. Los hongos descomponen materia orgánica y forman asociaciones simbióticas con plantas.`,
      Reptilia: `${scientificName} es una especie de reptil. Los reptiles son vertebrados de sangre fría con piel escamosa.`,
      Amphibia: `${scientificName} es una especie de anfibio. Los anfibios tienen una piel permeable y generalmente requieren agua para reproducirse.`,
    };

    return (
      descriptions[iconic] ||
      `${scientificName} es una especie registrada en la base de datos científica de biodiversidad.`
    );
  }

  // NUEVA FUNCIÓN: Redimensionar imagen si es muy grande
  function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // NUEVA FUNCIÓN: Identificar con Computer Vision (requiere API key)
  async function identifyWithComputerVision(file, apiKey) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      "https://api.inaturalist.org/v1/computervision/score_image",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  }

  // NUEVA FUNCIÓN: Buscar por tipo de organismo (método alternativo)
  async function searchByType(iconicTaxon) {
    try {
      const response = await fetch(
        `https://api.inaturalist.org/v1/taxa?iconic_taxa=${iconicTaxon}&per_page=5&order=desc&order_by=observations_count`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results;
      }
    } catch (error) {
      console.error("Error en búsqueda por tipo:", error);
    }
    return [];
  }

  // NUEVA FUNCIÓN: Buscar especies similares sin autenticación
  async function identifyWithSearch(file) {
    console.log("🔍 Usando método de búsqueda alternativo (sin autenticación)");
    
    // Buscar especies comunes de diferentes grupos
    const plantResults = await searchByType('Plantae');
    const animalResults = await searchByType('Animalia');
    const birdResults = await searchByType('Aves');
    
    // Combinar resultados y tomar los más comunes
    const allResults = [...plantResults, ...animalResults, ...birdResults];
    
    if (allResults.length > 0) {
      // Tomar el primer resultado como ejemplo (sería mejor implementar análisis de imagen real)
      const bestResult = allResults[0];
      return processSpeciesResult(bestResult, 0.5); // Confianza baja para método alternativo
    }
    
    throw new Error("No se pudieron obtener resultados de especies");
  }

  // NUEVA FUNCIÓN: Procesar resultado de especie
  function processSpeciesResult(specie, confidence = 1.0) {
    console.log("✅ Procesando especie:", specie.name);
    
    const spanishName = getSpanishName(specie);
    const scientificName = specie.name || "Nombre científico no disponible";
    const description = getOriginalDescription(specie);
    const taxonomyType = getTaxonomyType(specie.iconic_taxon_name);
    
    return {
      nombreComun: capitalizarPrimeraLetra(spanishName),
      nombreCientifico: scientificName,
      descripcion: description,
      tipo: taxonomyType,
      confidence: Math.round(confidence * 100),
      success: true
    };
  }

  // FUNCIÓN PRINCIPAL DE ANÁLISIS DE IMAGEN ACTUALIZADA
  async function analizarImagen(blob) {
    try {
      console.log('🔍 Iniciando análisis de imagen con nueva lógica...');
      
      // Redimensionar imagen si es muy grande
      const file = new File([blob], "captura.jpg", { type: blob.type });
      const resizedFile = await resizeImage(file, 800, 600);

      let resultado = null;

      // Método 1: Usar Computer Vision con API key si está disponible
      if (INATURALIST_API_KEY) {
        try {
          console.log('🧠 Intentando con Computer Vision API...');
          const visionData = await identifyWithComputerVision(resizedFile, INATURALIST_API_KEY);
          
          if (visionData && visionData.results && visionData.results.length > 0) {
            // Filtrar solo resultados que sean flora, fauna o fungi
            const validResults = visionData.results.filter((result) => {
              const iconic = result.taxon.iconic_taxon_name;
              return (
                iconic === "Plantae" ||
                iconic === "Animalia" ||
                iconic === "Aves" ||
                iconic === "Insecta" ||
                iconic === "Mammalia" ||
                iconic === "Reptilia" ||
                iconic === "Amphibia" ||
                iconic === "Fungi" ||
                iconic === "Actinopterygii" ||
                iconic === "Arachnida" ||
                iconic === "Mollusca"
              );
            });

            if (validResults.length === 0) {
              mostrarModalReconociendo(false);
              mostrarAlerta("No se reconoció flora ni fauna en la imagen", "warning");
              apagarCamara();
              document.getElementById("captureForm").classList.add("d-none");
              return;
            }

            // Obtener detalles del mejor resultado
            const bestResult = validResults[0];
            const taxaResponse = await fetch(
              `https://api.inaturalist.org/v1/taxa/${bestResult.taxon.id}?locale=es`
            );
            
            if (taxaResponse.ok) {
              const taxaData = await taxaResponse.json();
              const species = taxaData.results[0];
              resultado = processSpeciesResult(species, bestResult.combined_score);
              console.log('✅ Computer Vision exitoso');
            }
          }
        } catch (error) {
          console.warn("❌ Computer Vision falló:", error);
          
          // Si el token expiró, mostrar mensaje específico
          if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            mostrarAlerta("⏰ Token de API expirado. Obten uno nuevo en inaturalist.org/users/api_token", "warning");
          }
        }
      }

      // Método 2: Si no funcionó Computer Vision, usar búsqueda alternativa
      if (!resultado) {
        console.log('🔄 Usando método alternativo de búsqueda...');
        
        try {
          // Buscar especies comunes como fallback
          const plantResults = await searchByType('Plantae');
          if (plantResults.length > 0) {
            resultado = processSpeciesResult(plantResults[0], 0.3); // Confianza baja
            resultado.esMetodoAlternativo = true;
          }
        } catch (error) {
          console.error("❌ Método alternativo falló:", error);
        }
      }

      mostrarModalReconociendo(false);

      if (resultado && resultado.success) {
        // Llenar los campos del formulario
        nombreComunInput.value = resultado.nombreComun;
        nombreCientificoInput.value = resultado.nombreCientifico;
        descripcionInput.value = resultado.descripcion;
        tipoInput.value = resultado.tipo;
        
        console.log("✅ Información completada exitosamente:");
        console.log("- Nombre común:", resultado.nombreComun);
        console.log("- Nombre científico:", resultado.nombreCientifico);
        console.log("- Tipo:", resultado.tipo);
        console.log("- Confianza:", resultado.confidence + "%");
        
        if (resultado.esMetodoAlternativo) {
          mostrarAlerta(`Especie sugerida: ${resultado.nombreComun} (método alternativo - verificar manualmente)`, "warning");
        } else {
          mostrarAlerta(`Especie identificada: ${resultado.nombreComun} (${resultado.confidence}% confianza)`, "success");
        }
      } else {
        // Si falló todo, permitir llenado manual
        nombreComunInput.value = "";
        nombreCientificoInput.value = "";
        descripcionInput.value = "";
        tipoInput.value = "";
        
        mostrarAlerta("No se pudo identificar la especie. Por favor, completa la información manualmente.", "warning");
        console.log("❌ Identificación falló - requiere llenado manual");
      }

      // Mostrar imagen capturada y detener cámara
      if (camStream) {
        camStream.getTracks().forEach(track => track.stop());
        camStream = null;
      }
      
      // MOSTRAR LA IMAGEN CON EL MISMO TAMAÑO QUE TENÍA LA CÁMARA
      const img = document.createElement("img");
      img.src = URL.createObjectURL(blob);
      img.classList.add("img-fluid");
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover"; // Mantener el mismo comportamiento que el video
      img.style.borderRadius = "inherit"; // Heredar border-radius del contenedor
      
      cameraPreview.innerHTML = "";
      cameraPreview.appendChild(img);

      // Actualizar estado de botones
      capturePhotoBtn.disabled = true;
      stopCameraBtn.disabled = true;
      startCameraBtn.disabled = false;
      startCameraBtn.innerHTML = '<i class="fas fa-video me-2"></i><span class="d-none d-sm-inline">Iniciar </span>Cámara';

      const toggleBtn = document.getElementById('toggleCameraBtn');
      if (toggleBtn) {
        toggleBtn.style.display = 'none';
        toggleBtn.disabled = true;
      }

      document.getElementById("captureForm").classList.remove("d-none");

    } catch (error) {
      console.error("❌ Error completo en análisis:", error);
      mostrarModalReconociendo(false);
      
      let errorMessage = "Error desconocido al analizar la imagen";
      
      if (error.message.includes("401")) {
        errorMessage = "API Key requerida o expirada. Obtén una nueva en inaturalist.org/users/api_token";
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "Problema de conexión. Verifica tu internet.";
      } else {
        errorMessage = error.message;
      }
      
      mostrarAlerta("Error al analizar imagen: " + errorMessage, "danger");
      apagarCamara();
      document.getElementById("captureForm").classList.add("d-none");
    }
  }

  // Cancelar captura y ocultar formulario
  document.getElementById("cancelCapture").addEventListener("click", () => {
    document.getElementById("captureForm").classList.add("d-none");
    formRegistro.reset();
    fotoBlob = null;
    apagarCamara();
  });

  // Guardar registro - PROTEGIDO CONTRA DOBLE CLICK
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Prevenir doble envío
    const submitBtn = formRegistro.querySelector('button[type="submit"]');
    if (submitBtn && submitBtn.disabled) {
      console.log('⚠️ Envío ya en proceso, ignorando...');
      return;
    }
    
    if (!fotoBlob) {
      mostrarAlerta("No has capturado una foto.", "warning");
      return;
    }
    if (!tipoInput.value || !nombreComunInput.value || !nombreCientificoInput.value) {
      mostrarAlerta("Completa los campos obligatorios.", "warning");
      return;
    }

    // Deshabilitar botón y mostrar estado de carga
    if (submitBtn) {
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando...';
      
      // Función para restaurar el botón
      const restaurarBoton = () => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      };
      
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
          restaurarBoton();
        })
        .catch((error) => {
          console.error('Error en guardado:', error);
          mostrarAlerta("Error de conexión con el servidor", "danger");
          restaurarBoton();
        });
    }
  });

  // Inicializar todo al cargar la página
  inicializar();
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