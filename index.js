const express = require('express')
const app = express()
const http = require('http');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const argv = yargs.argv;
const empresa = argv.empresa;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/datetime')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const formato = url.searchParams.get('formato') === 'am/pm' ? 'am/pm' : '24h';
    const anio = url.searchParams.get('anio') === 'abreviado' ? '2-digit' : 'numeric';
    const dateOptions = formato === 'am/pm' ? { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric', year: anio } : { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric', month: 'numeric', year: anio };
    const datetime = new Date().toLocaleString(undefined, dateOptions);
    const message = `Este servicio llega a usted gracias a ${empresa || 'Almanab'}. Fecha y hora (${formato === 'am/pm' ? 'AM/PM' : '24 horas'}, año ${anio === 'numeric' ? 'completo' : 'abreviado'}): ${datetime}`;

    res.setHeader('Content-Type', 'text/plain');
    res.end(message);
  } 
  else if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error interno del servidor');
        console.error(err);
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url === '/script.js') {
    fs.readFile(path.join(__dirname, 'script.js'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error interno del servidor');
        console.error(err);
      } else {
        res.setHeader('Content-Type', 'application/javascript');
        res.end(data);
      }
    });
  }
  
  else {
    res.statusCode = 404;
    res.end();
  }
  
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
