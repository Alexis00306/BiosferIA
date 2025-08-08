// servidor-arduino.js
const http = require('http');
const { exec } = require('child_process');
const url = require('url');

const server = http.createServer((req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.url.startsWith('/enviar-arduino')) {
    const query = url.parse(req.url, true).query;
    
    const cientifico = query.c || '';
    const comun = query.n || '';
    const descripcion = query.d || '';
    
    if (cientifico && comun && descripcion) {
      console.log('🔍 Ejecutando envío al Arduino...');
      console.log('   Especie:', comun);
      
      const path = require('path');
      const comando = `node "${path.join(__dirname, 'arduino.js')}" "${cientifico}" "${comun}" "${descripcion}"`;

      
      exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error:', error);
          res.writeHead(500);
          res.end('Error al ejecutar');
        } else {
          console.log(stdout);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('✅ Enviado al Arduino');
        }
      });
      
    } else {
      res.writeHead(400);
      res.end('Faltan parámetros');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('🚀 Servidor Arduino listo en http://localhost:3001');
  console.log('📡 Esperando datos de especies...');
});