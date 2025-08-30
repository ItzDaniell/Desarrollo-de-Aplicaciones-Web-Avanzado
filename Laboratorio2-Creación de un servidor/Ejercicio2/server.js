const http = require('http')
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'views', 'home.hbs');

        fs.readFile(filePath, 'utf-8', (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end('<h1>Error del servidor</h1><p>No se pudo cargar la página.</p>');
                return;
            }
            
            const template = handlebars.compile(templateData);

            const data = {
                title: "Servidor con Handlebars",
                welcomeMessage: "Bienvenido a mi servidor de NodeJS con Handlebars",
                day: new Date().toLocaleDateString(),
                students: ["Ana", "Luis", "Pedro", "Maria"]
            }

            const html = template(data);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end('<h1>Página no encontrada</h1><p>Lo sentimos, no encontramos la página que buscas.</p>');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});