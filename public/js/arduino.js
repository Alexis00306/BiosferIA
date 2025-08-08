const { SerialPort } = require('serialport');

const nombreCientifico = process.argv[2];
const nombreComun = process.argv[3]; 
let descripcion = process.argv[4];

// Aumentar límite a 200 caracteres (ajusta según necesites)
if (descripcion && descripcion.length > 200) {
  descripcion = descripcion.substring(0, 197) + "...";
}

const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600,
  autoOpen: false
});

// Función para enviar línea con delay apropiado
function enviarLinea(texto, callback) {
  if (texto.length > 80) {
    // Para textos largos, enviar más lento
    enviarTextoLento(texto, callback);
  } else {
    // Para textos cortos, envío normal
    port.write(texto + '\n', callback);
  }
}

// Función para enviar textos largos carácter por carácter
function enviarTextoLento(texto, callback) {
  let index = 0;
  
  function enviarSiguienteChar() {
    if (index < texto.length) {
      port.write(texto[index], (err) => {
        if (err) {
          callback(err);
          return;
        }
        index++;
        setTimeout(enviarSiguienteChar, 3); // 8ms entre caracteres
      });
    } else {
      port.write('\n', callback);
    }
  }
  
  enviarSiguienteChar();
}

port.open((err) => {
  if (err) return console.error('Error:', err.message);
  
  setTimeout(() => {
    // Enviar nombre común
    enviarLinea(nombreComun, (err) => {
      if (err) return console.error('Error:', err.message);
      
      setTimeout(() => {
        // Enviar nombre científico
        enviarLinea(nombreCientifico, (err) => {
          if (err) return console.error('Error:', err.message);
          
          setTimeout(() => {
            // Enviar descripción
            enviarLinea(descripcion, (err) => {
              if (err) return console.error('Error:', err.message);
              
              console.log('✅ Datos enviados:', nombreComun);
              
              setTimeout(() => {
                port.close();
              }, 1500);
            });
          }, 800);
        });
      }, 800);
    });
  }, 2000);
});