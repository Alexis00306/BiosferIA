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

  // Función para capitalizar primera letra
  function capitalizarPrimeraLetra(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  // Función MEJORADA para formatear nombre científico (formato binomial)
  function formatearNombreCientifico(nombre) {
    if (!nombre) return "";
    
    // Limpiar el nombre de caracteres extraños y espacios múltiples
    let nombreLimpio = nombre.trim()
      .replace(/['"()]/g, '') // Quitar comillas y paréntesis
      .replace(/\s+/g, ' ') // Normalizar espacios
      .replace(/[^a-zA-Z\s]/g, ''); // Solo letras y espacios
    
    // Separar por espacios
    const partes = nombreLimpio.split(/\s+/).filter(p => p.length > 0);
    
    if (partes.length >= 2) {
      // Validar que tenga formato científico: Primera palabra capitalizada, resto minúsculas
      const genero = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase();
      const especie = partes[1].toLowerCase();
      
      // Verificar que no sean palabras comunes en español/inglés
      const palabrasComunes = ['the', 'and', 'or', 'is', 'are', 'la', 'el', 'y', 'o', 'es', 'son', 'de', 'del'];
      if (palabrasComunes.includes(genero.toLowerCase()) || palabrasComunes.includes(especie.toLowerCase())) {
        return capitalizarPrimeraLetra(nombreLimpio);
      }
      
      // Formar nombre científico: Género especie [subespecie]
      let nombreFinal = genero + " " + especie;
      if (partes.length > 2) {
        // Agregar subspecies/variedad si existe
        nombreFinal += " " + partes.slice(2).map(p => p.toLowerCase()).join(" ");
      }
      
      return nombreFinal;
    }
    
    return capitalizarPrimeraLetra(nombreLimpio);
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

  // Función para validar si es un nombre científico real (MANTENIENDO TU FUNCIÓN ORIGINAL)
  function esNombreCientificoValido(nombre) {
    if (!nombre) return false;
    
    // Limpiar y verificar formato básico
    const nombreLimpio = nombre.trim();
    const partes = nombreLimpio.split(/\s+/);
    
    // Debe tener al menos 2 palabras (Género especie)
    if (partes.length < 2) return false;
    
    // Primera palabra debe empezar con mayúscula, segunda con minúscula
    if (!/^[A-Z][a-z]+$/.test(partes[0]) || !/^[a-z]+$/.test(partes[1])) return false;
    
    // Lista de nombres comunes en inglés que NO son nombres científicos
    const nombresComunes = [
      'red rose', 'white oak', 'black bear', 'blue jay', 'green tree', 'yellow flower',
      'common oak', 'house cat', 'tree frog', 'grass snake', 'field mouse', 'garden rose',
      'wild rose', 'pine tree', 'oak tree', 'maple tree', 'apple tree', 'cherry tree',
      'house plant', 'water lily', 'sun flower', 'corn plant', 'bean plant', 'grape vine',
      'house spider', 'wood duck', 'sea turtle', 'tree bark', 'leaf green', 'flower red'
    ];
    
    // Verificar que no sea un nombre común
    const nombreCompleto = nombreLimpio.toLowerCase();
    if (nombresComunes.includes(nombreCompleto)) return false;
    
    // Verificar que las palabras no sean demasiado comunes en inglés
    const palabrasProhibidas = ['tree', 'plant', 'flower', 'animal', 'bird', 'fish', 'snake', 'frog', 'spider', 'leaf', 'grass', 'moss', 'wood', 'water', 'house', 'garden', 'wild', 'common', 'black', 'white', 'red', 'blue', 'green', 'yellow'];
    
    for (const parte of partes) {
      if (palabrasProhibidas.includes(parte.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  }

  // FUNCIÓN MEJORADA para extraer nombre común del extracto (MANTENIENDO TU FUNCIÓN)
  function obtenerNombreComunDesdeExtracto(extract, nombreCientifico) {
    if (!extract) return nombreCientifico || "No disponible";

    // Obtener la primera oración (hasta el primer punto)
    const primeraOracion = extract.split(".")[0];

    // Patrones mejorados para capturar nombres comunes
    const patrones = [
      // "La mamba negra (Dendroaspis polylepis) es una..."
      /^(La|El|Los|Las|Un|Una)?\s*([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ\s]+?)\s*\([A-Z][a-z]+\s+[a-z]+\)/,
      // "El colibrí, también llamado picaflor"
      /^(La|El|Los|Las|Un|Una)?\s*([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ\s]+?)\s*[,.]?\s*(también llamad[oa]|es una especie de|es un|es una|es el|es la)/i,
      // "Black mamba (Dendroaspis polylepis)" -> extraer "Black mamba"
      /^([A-Z][a-zA-Z\s]+?)\s*\([A-Z][a-z]+\s+[a-z]+\)/,
      // Primera palabra(s) capitalizada(s) después de artículos
      /^(The|La|El|Los|Las|Un|Una)?\s*([A-Z][a-zA-Z\s]+?)(\s+(is|are|es|son)\s+)/i,
      // Patrón general para nombres al inicio
      /^(The|La|El|Los|Las|Un|Una)?\s*([A-Z][a-zA-Z\s]{2,25})/
    ];

    for (const patron of patrones) {
      const match = primeraOracion.match(patron);
      if (match && match[2]) {
        let nombre = match[2].trim().replace(/[.,;:()"]/g, "");
        
        // Limpiar palabras innecesarias al final
        nombre = nombre.replace(/\s+(is|are|es|son|also|también)$/i, "");
        
        // Validar que no sea muy largo ni muy corto
        if (nombre.length > 2 && nombre.length < 35 && !esNombreCientificoValido(nombre)) {
          return capitalizarPrimeraLetra(nombre);
        }
      }
    }

    // Si no encuentra nada específico, usar el nombre científico capitalizado
    return capitalizarPrimeraLetra(nombreCientifico) || "No disponible";
  }

  // FUNCIÓN MEJORADA PARA EXTRAER NOMBRE CIENTÍFICO DEL TÍTULO (MANTENIENDO TU FUNCIÓN)
  function extraerNombreCientificoDelTitulo(data) {
    console.log("Título de Wikipedia:", data.title);
    
    // Primero buscar en el extracto patrones como "La mamba negra (Dendroaspis polylepis)"
    if (data.extract) {
      // Múltiples patrones para nombres científicos en paréntesis
      const patronesExtracto = [
        /\(([A-Z][a-z]+\s+[a-z]+(?:\s+[a-z]+)*)\)/g, // (Genus species)
        /nombre científico:?\s*([A-Z][a-z]+\s+[a-z]+)/i, // nombre científico: Genus species
        /científicamente como\s+([A-Z][a-z]+\s+[a-z]+)/i, // científicamente como Genus species
        /binomial:?\s*([A-Z][a-z]+\s+[a-z]+)/i // binomial: Genus species
      ];
      
      for (const patron of patronesExtracto) {
        const matches = data.extract.matchAll ? Array.from(data.extract.matchAll(patron)) : [data.extract.match(patron)];
        for (const match of matches) {
          if (match && match[1] && esNombreCientificoValido(match[1])) {
            console.log("✅ Nombre científico del extracto:", match[1]);
            return match[1];
          }
        }
      }
    }
    
    // Luego verificar si el título tiene formato científico (Género especie)
    if (data.title && esNombreCientificoValido(data.title.trim())) {
      console.log("✅ Nombre científico del título:", data.title);
      return data.title.trim();
    }
    
    return null;
  }

  // Traducir texto
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

  // Buscar en Wikipedia
  function buscarEnWikipedia(nombre, idioma) {
    return fetch(`https://${idioma}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombre)}`)
      .then(res => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      });
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

  // NUEVA FUNCIÓN: Buscar nombre común en español usando el nombre científico
  async function buscarNombreComunEnEspanol(nombreCientifico) {
    console.log("🇪🇸 Buscando nombre común en español para:", nombreCientifico);
    
    try {
      // Primero probar en Wikipedia ES con el nombre científico
      const infoES = await buscarEnWikipedia(nombreCientifico, "es");
      if (infoES.extract) {
        const nombreComun = obtenerNombreComunDesdeExtracto(infoES.extract, nombreCientifico);
        if (nombreComun && nombreComun !== nombreCientifico) {
          console.log("✅ Nombre común encontrado en Wikipedia ES:", nombreComun);
          return nombreComun;
        }
      }
    } catch (error) {
      // No hacer nada, continuar con otras estrategias
    }

    try {
      // Probar con iNaturalist para obtener nombres en español
      const respuesta = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(nombreCientifico)}&locale=es`);
      const json = await respuesta.json();
      
      if (json.results && json.results.length > 0) {
        const taxon = json.results[0];
        // Buscar nombres comunes en español
        const nombreEspanol = taxon.common_name?.name;
        if (nombreEspanol && nombreEspanol !== nombreCientifico) {
          console.log("✅ Nombre común encontrado en iNaturalist ES:", nombreEspanol);
          return nombreEspanol;
        }
      }
    } catch (error) {
      console.log("❌ Error buscando en iNaturalist ES:", error);
    }

    console.log("❌ No se encontró nombre común en español");
    return null;
  }

  // NUEVA FUNCIÓN: Buscar por nombre científico directamente
  async function buscarPorNombreCientifico(nombreCientifico) {
    console.log("🧬 Buscando directamente por nombre científico:", nombreCientifico);
    
    // Probar en Wikipedia ES
    try {
      const info = await buscarEnWikipedia(nombreCientifico, "es");
      if (info.extract) {
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreCientifico);
        const tipoWikipedia = determinarTipoDesdeExtracto(info.extract);
        const descripcionCorta = info.extract.split(".")[0] + ".";

        return {
          nombreComun: capitalizarPrimeraLetra(nombreComun),
          nombreCientifico: formatearNombreCientifico(nombreCientifico),
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia ES (nombre científico)",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ Nombre científico no encontrado en Wikipedia ES");
    }

    // Probar en Wikipedia EN
    try {
      const info = await buscarEnWikipedia(nombreCientifico, "en");
      if (info.extract) {
        const descripcionTraducida = await traducir(info.extract);
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreCientifico);
        const tipoWikipedia = determinarTipoDesdeExtracto(descripcionTraducida);
        const descripcionCorta = descripcionTraducida.split(".")[0] + ".";

        // Buscar nombre común en español
        const nombreComunEspanol = await buscarNombreComunEnEspanol(nombreCientifico);

        return {
          nombreComun: capitalizarPrimeraLetra(nombreComunEspanol || nombreComun),
          nombreCientifico: formatearNombreCientifico(nombreCientifico),
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia EN (nombre científico)",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ Nombre científico no encontrado en Wikipedia EN");
    }

    return { success: false };
  }

  // FUNCIÓN PRINCIPAL MEJORADA: Buscar en iNaturalist primero, luego Wikipedia
  async function procesarInformacionWikipedia(nombreDetectado) {
    console.log("🔍 Iniciando búsqueda para:", nombreDetectado);

    // ESTRATEGIA PRINCIPAL: Buscar en iNaturalist primero para obtener nombre científico confiable
    try {
      console.log("🌿 Buscando en iNaturalist...");
      const respuesta = await fetch(`https://api.inaturalist.org/v1/search?q=${encodeURIComponent(nombreDetectado)}&sources=taxa&per_page=5`);
      const json = await respuesta.json();

      if (json.results && json.results.length > 0) {
        // Buscar la mejor coincidencia (preferir especies específicas sobre familias)
        let mejorCoincidencia = json.results[0];
        
        // Intentar encontrar una especie específica (nombre binomial)
        for (const resultado of json.results) {
          if (resultado.record?.name && esNombreCientificoValido(resultado.record.name)) {
            mejorCoincidencia = resultado;
            break;
          }
        }

        const especie = mejorCoincidencia.record;
        const nombreCientifico = especie.name;
        const tipo = especie.iconic_taxon_name ? especie.iconic_taxon_name.toLowerCase() : null;
        
        console.log("✅ iNaturalist - Encontrado:", {
          nombre: nombreCientifico,
          tipo: tipo,
          rank: especie.rank
        });
        
        // Ahora buscar información detallada usando el nombre científico
        const infoDetallada = await buscarInformacionConNombreCientifico(nombreCientifico);
        
        if (infoDetallada.success) {
          return {
            nombreComun: infoDetallada.nombreComun,
            nombreCientifico: formatearNombreCientifico(nombreCientifico),
            descripcion: infoDetallada.descripcion,
            tipo: infoDetallada.tipo || (tipo === "plants" ? "flora" : (tipo ? "fauna" : null)),
            fuente: infoDetallada.fuente,
            success: true
          };
        } else {
          // Si no encuentra info detallada en Wikipedia, usar la básica de iNaturalist
          const nombreComun = especie.preferred_common_name || capitalizarPrimeraLetra(nombreDetectado);
          const descripcion = especie.wikipedia_summary || `${especie.rank || 'Taxón'} identificado en base de datos especializada.`;
          
          return {
            nombreComun: capitalizarPrimeraLetra(nombreComun),
            nombreCientifico: formatearNombreCientifico(nombreCientifico),
            descripcion: descripcion.split(".")[0] + ".",
            tipo: tipo === "plants" ? "flora" : (tipo ? "fauna" : null),
            fuente: "iNaturalist (básico)",
            success: true
          };
        }
      }
    } catch (e) {
      console.log("❌ Error al buscar en iNaturalist:", e);
    }

    // FALLBACK: Búsqueda tradicional si iNaturalist no funciona
    console.log("🔄 iNaturalist no encontró resultados, usando búsqueda tradicional...");
    return await busquedaTradicional(nombreDetectado);
  }

  // NUEVA FUNCIÓN: Buscar información detallada usando nombre científico
  async function buscarInformacionConNombreCientifico(nombreCientifico) {
    console.log("🧬 Buscando información detallada para:", nombreCientifico);
    
    // 1. Probar en Wikipedia ES con el nombre científico
    try {
      const info = await buscarEnWikipedia(nombreCientifico, "es");
      if (info.extract) {
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreCientifico);
        const tipoWikipedia = determinarTipoDesdeExtracto(info.extract);
        const descripcionCorta = info.extract.split(".")[0] + ".";

        console.log("✅ Wikipedia ES - Información encontrada");
        return {
          nombreComun: capitalizarPrimeraLetra(nombreComun),
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia ES + iNaturalist",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ No encontrado en Wikipedia ES con nombre científico");
    }

    // 2. Probar en Wikipedia EN con el nombre científico y traducir
    try {
      const info = await buscarEnWikipedia(nombreCientifico, "en");
      if (info.extract) {
        const descripcionTraducida = await traducir(info.extract);
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreCientifico);
        const tipoWikipedia = determinarTipoDesdeExtracto(descripcionTraducida);
        const descripcionCorta = descripcionTraducida.split(".")[0] + ".";

        // Buscar nombre común en español
        const nombreComunEspanol = await buscarNombreComunEnEspanol(nombreCientifico);

        console.log("✅ Wikipedia EN - Información encontrada y traducida");
        return {
          nombreComun: capitalizarPrimeraLetra(nombreComunEspanol || nombreComun),
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia EN + iNaturalist",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ No encontrado en Wikipedia EN con nombre científico");
    }

    // 3. Intentar búsqueda por nombres comunes relacionados
    try {
      const nombreComunEspanol = await buscarNombreComunEnEspanol(nombreCientifico);
      if (nombreComunEspanol) {
        console.log("✅ Nombre común en español encontrado:", nombreComunEspanol);
        
        // Buscar en Wikipedia ES con el nombre común
        const info = await buscarEnWikipedia(nombreComunEspanol, "es");
        if (info.extract) {
          const tipoWikipedia = determinarTipoDesdeExtracto(info.extract);
          const descripcionCorta = info.extract.split(".")[0] + ".";

          return {
            nombreComun: capitalizarPrimeraLetra(nombreComunEspanol),
            descripcion: descripcionCorta,
            tipo: tipoWikipedia,
            fuente: "Wikipedia ES + iNaturalist (nombre común)",
            success: true
          };
        }
      }
    } catch (error) {
      console.log("❌ No se pudo buscar por nombre común");
    }

    console.log("❌ No se encontró información detallada");
    return { success: false };
  }

  // FUNCIÓN DE FALLBACK: Búsqueda tradicional (MANTENIENDO TU LÓGICA ORIGINAL)
  async function busquedaTradicional(nombreDetectado) {
    let nombreParaBuscar = nombreDetectado.trim()
      .toLowerCase()
      .replace(/[^a-záéíóúñü\s]/gi, "")
      .replace(/\s+/g, " ");
    nombreParaBuscar = capitalizarPrimeraLetra(nombreParaBuscar);

    // Si el nombre detectado parece ser un nombre científico, úsalo directamente
    if (esNombreCientificoValido(nombreDetectado)) {
      console.log("✅ Nombre detectado parece científico, buscando por nombre científico...");
      const resultadoCientifico = await buscarPorNombreCientifico(nombreDetectado);
      if (resultadoCientifico.success) {
        return resultadoCientifico;
      }
    }

    // Buscar en Wikipedia ES
    try {
      const info = await buscarEnWikipedia(nombreParaBuscar, "es");
      const tipoWikipedia = determinarTipoDesdeExtracto(info.extract);

      if (info.extract) {
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreDetectado);
        const nombreCientificoExtraido = extraerNombreCientificoDelTitulo(info);
        
        let nombreCientifico = nombreCientificoExtraido;
        if (!nombreCientifico && esNombreCientificoValido(nombreDetectado)) {
          nombreCientifico = nombreDetectado;
        }
        
        const descripcionCorta = info.extract.split(".")[0] + ".";

        return {
          nombreComun: capitalizarPrimeraLetra(nombreComun),
          nombreCientifico: nombreCientifico ? formatearNombreCientifico(nombreCientifico) : "",
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia (ES) - Fallback",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ Fallback: No encontrado en Wikipedia ES");
    }

    // Buscar en Wikipedia EN
    try {
      const info = await buscarEnWikipedia(nombreDetectado, "en");

      if (info.extract) {
        const descripcionTraducida = await traducir(info.extract);
        const tipoWikipedia = determinarTipoDesdeExtracto(descripcionTraducida);
        const nombreComun = obtenerNombreComunDesdeExtracto(info.extract, nombreDetectado);
        const nombreCientificoExtraido = extraerNombreCientificoDelTitulo(info);
        
        let nombreCientifico = nombreCientificoExtraido;
        if (!nombreCientifico && esNombreCientificoValido(nombreDetectado)) {
          nombreCientifico = nombreDetectado;
        }
        
        const descripcionCorta = descripcionTraducida.split(".")[0] + ".";

        let nombreComunEspanol = nombreComun;
        if (nombreCientifico) {
          const nombreComunBuscado = await buscarNombreComunEnEspanol(nombreCientifico);
          if (nombreComunBuscado) {
            nombreComunEspanol = nombreComunBuscado;
          }
        }

        return {
          nombreComun: capitalizarPrimeraLetra(nombreComunEspanol),
          nombreCientifico: nombreCientifico ? formatearNombreCientifico(nombreCientifico) : "",
          descripcion: descripcionCorta,
          tipo: tipoWikipedia,
          fuente: "Wikipedia (EN) - Fallback",
          success: true
        };
      }
    } catch (error) {
      console.log("❌ Fallback: No encontrado en Wikipedia EN");
    }

    console.log("❌ Búsqueda tradicional falló completamente");
    return { success: false };
  }

  // FUNCIÓN DE ANÁLISIS DE IMAGEN MEJORADA
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
                  { type: "WEB_DETECTION", maxResults: 15 }, // Aumentado para más opciones
                  { type: "LABEL_DETECTION", maxResults: 10 } // Aumentado para más opciones
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

          // Función para filtrar candidatos válidos
          function esCandidatoValido(nombre) {
            if (!nombre || nombre.length < 3) return false;
            const palabrasGenerales = ['animal', 'plant', 'tree', 'flower', 'bird', 'fish', 'insect', 'mammal', 'reptile', 'nature', 'wildlife'];
            return !palabrasGenerales.includes(nombre.toLowerCase());
          }

          // Evaluar todas las opciones y elegir la mejor
          const candidatos = [
            ...webEntities.map(e => ({ 
              nombre: e.description, 
              score: e.score || 0, 
              fuente: 'web',
              valido: esCandidatoValido(e.description)
            })),
            ...labels.map(l => ({ 
              nombre: l.description, 
              score: l.score || 0, 
              fuente: 'label',
              valido: esCandidatoValido(l.description)
            }))
          ];

          // Filtrar y ordenar candidatos válidos
          const candidatosValidos = candidatos
            .filter(c => c.valido)
            .sort((a, b) => b.score - a.score);

          console.log("🔍 Candidatos detectados:", candidatosValidos.slice(0, 5).map(c => `${c.nombre} (${(c.score * 100).toFixed(1)}%)`));

          let nombreDetectado = null;
          let score = 0;

          if (candidatosValidos.length > 0) {
            const mejor = candidatosValidos[0];
            nombreDetectado = mejor.nombre;
            score = (mejor.score * 100).toFixed(1);
            console.log(`✅ Mejor candidato seleccionado: ${nombreDetectado} (${score}% - ${mejor.fuente})`);
          }

          if (!nombreDetectado) {
            mostrarModalReconociendo(false);
            mostrarAlerta("No se detectó ninguna especie válida en la imagen", "warning");
            apagarCamara();
            document.getElementById("captureForm").classList.add("d-none");
            resolve();
            return;
          }

          // Determinar tipo inicial basado en todas las descripciones
          const todasDescripciones = candidatos.map(c => c.nombre.toLowerCase());
          const tipoInicial = determinarTipo(todasDescripciones.find(desc => determinarTipo(desc) !== null) || "");

          if (!tipoInicial) {
            mostrarModalReconociendo(false);
            mostrarAlerta("No se reconoció flora ni fauna en la imagen", "warning");
            apagarCamara();
            document.getElementById("captureForm").classList.add("d-none");
            resolve();
            return;
          }

          // Buscar información completa usando el nuevo flujo optimizado
          const infoCompleta = await procesarInformacionWikipedia(nombreDetectado);

          // Rellenar formulario con la información encontrada
          if (infoCompleta.success) {
            nombreComunInput.value = infoCompleta.nombreComun;
            nombreCientificoInput.value = infoCompleta.nombreCientifico;
            descripcionInput.value = infoCompleta.descripcion;
            tipoInput.value = infoCompleta.tipo || tipoInicial;
            
            console.log("✅ Información completada exitosamente:");
            console.log("- Nombre común:", infoCompleta.nombreComun);
            console.log("- Nombre científico:", infoCompleta.nombreCientifico);
            console.log("- Tipo:", infoCompleta.tipo || tipoInicial);
            console.log("- Fuente:", infoCompleta.fuente);
            
            mostrarAlerta(`Especie identificada: ${infoCompleta.nombreComun}`, "success");
          } else {
            // Información básica cuando no se encuentra información completa
            nombreComunInput.value = capitalizarPrimeraLetra(nombreDetectado);
            nombreCientificoInput.value = "";
            descripcionInput.value = "";
            tipoInput.value = tipoInicial;
            
            mostrarAlerta("Se detectó la especie pero se necesita completar información manualmente", "warning");
            console.log("⚠️ Información básica - requiere llenado manual");
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