const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const filePath = path.join(__dirname, "views", "home.hbs");

    fs.readFile(filePath, "utf-8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end(
          "<h1>Error del servidor</h1><p>No se pudo cargar la página.</p>"
        );
        return;
      }

      const template = handlebars.compile(templateData);

      const data = {
        title: "Servidor con Handlebars",
        welcomeMessage: "Bienvenido a mi servidor de NodeJS con Handlebars",
        day: new Date().toLocaleDateString(),
        students: ["Ana", "Luis", "Pedro", "Maria"],
      };

      const html = template(data);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.end(html);
    });
  } else if (req.url === "/about") {
    const filePath = path.join(__dirname, "views", "about.hbs");

    fs.readFile(filePath, "utf-8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end(
          "<h1>Error del servidor</h1><p>No se pudo cargar la página.</p>"
        );
        return;
      }

      const template = handlebars.compile(templateData);

      const data = {
        title: "Servidor con Handlebars",
        welcomeMessage: "Bienvenido a la página de información de la clase",
        className: "Desarrollo de Aplicaciones Web Avanzado",
        instructor: "Arevalo Sermeño Edwin William",
        day: new Date().toLocaleDateString(),
      };

      const html = template(data);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.end(html);
    });
  } else if (req.url === "/students") {
    const filePath = path.join(__dirname, "views", "students.hbs");

    fs.readFile(filePath, "utf-8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end(
          "<h1>Error del servidor</h1><p>No se pudo cargar la página.</p>"
        );
        return;
      }

      const template = handlebars.compile(templateData);

        const listStudents = [
        { firstName: "Ana", lastName: "Gomez", note: 10 },
        { firstName: "Luis", lastName: "Martinez", note: 14 },
        { firstName: "Pedro", lastName: "Lopez", note: 15 },
        { firstName: "Maria", lastName: "Hernandez", note: 20 },
        ];

        const data = {
        title: "Lista de Estudiantes",
        welcomeMessage: "Bienvenido a la página de informacion de los estudiantes",
        listStudents,
        studentsWithState: listStudents.map((a) => ({
            ...a,
            aprobado: a.note > 15,
        })),
        };

      const html = template(data);

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.end(html);
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.end(
      "<h1>Página no encontrada</h1><p>Lo sentimos, no encontramos la página que buscas.</p>"
    );
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
