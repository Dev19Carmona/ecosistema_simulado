const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Servir el dashboard.html en la raíz
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'dashboard.html');
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error al cargar el dashboard');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`📊 Dashboard disponible en http://localhost:${PORT}`);
  console.log(`💡 Asegúrate de que el servidor NestJS esté corriendo en el puerto 3000`);
});


