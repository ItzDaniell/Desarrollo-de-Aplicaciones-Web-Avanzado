const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    if (req.url === '/') {
        res.statusCode = 200;
        res.end('<h1>Bienvenido a mi servidor de NodeJS</h1>');
    } else if (req.url === '/about') {
        res.statusCode = 200;
        res.end('<h1>Acerca de nosotros</h1><p>Este es un servidor creado con NodeJS</p>');
    } else if (req.url === '/contact') {
        res.statusCode = 200;
        res.end('<h1>Contacto</h1><p>Puedes contactarnos a través de este formulario.</p>');
    } else if (req.url === '/services') {
        res.statusCode = 200;
        res.end('<h1>Servicios</h1><p>Estos son los servicios que ofrecemos.</p><ul><li>Servicio 1</li><li>Servicio 2</li><li>Servicio 3</li></ul>');
    } else if (req.url === '/error') {
        res.statusCode = 500;
        res.end('<h1>Error del servidor</h1><p>Ha ocurrido un error en el servidor.</p>');
    } else {
        res.statusCode = 404;
        res.end('<h1>Error 404: Página no encontrada</h1>');
    }
})

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});