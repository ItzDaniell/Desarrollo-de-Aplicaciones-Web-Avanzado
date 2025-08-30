const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const { method, url } = req;

  if (url === "/students" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
  } else if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);
    if (student) {
      res.statusCode = 200;
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Student Not Found" }));
    }
  } else if (url === "/students" && method === "POST") {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const newStudent = JSON.parse(body);

            // Validación de campos obligatorios
            const requiredFields = ["name", "email", "course", "phone"];
            const missingFields = requiredFields.filter(field => !newStudent[field] || newStudent[field].trim() === "");

            if (missingFields.length > 0) {
                res.statusCode = 400;
                return res.end(JSON.stringify({
                    error: `Faltan los siguientes campos obligatorios: ${missingFields.join(", ")}`
                }));
            }

            const createdStudent = repo.create(newStudent);
            res.statusCode = 201;
            res.end(JSON.stringify(createdStudent));

        } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "JSON inválido o mal formado" }));
        }
    });
} else if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const updateData = JSON.parse(body);
      const updatedStudent = repo.update(id, updateData);
      if (updatedStudent) {
        res.statusCode = 200;
        res.end(JSON.stringify(updatedStudent));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Student Not Found" }));
      }
    });
  } else if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deletedStudent = repo.remove(id);
    if (deletedStudent) {
      res.statusCode = 200;
      res.end(JSON.stringify(deletedStudent));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Student Not Found" }));
    }
  } else if (url === "/ListByStatus" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { status } = JSON.parse(body);
        if (!status) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: "Debe enviar el campo 'status'" }));
          return;
        }

        const all = repo.getAll();
        const filtered = all.filter((s) =>
          status === "aprobado" ? s.grade >= 11 : s.grade < 11
        );

        res.statusCode = 200;
        res.end(JSON.stringify(filtered));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // POST /ListByGrade → filtrar por rango de nota
  else if (url === "/ListByGrade" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { min, max } = JSON.parse(body);
        if (min === undefined || max === undefined) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({ message: "Debe enviar los campos 'min' y 'max'" })
          );
          return;
        }

        const all = repo.getAll();
        const filtered = all.filter((s) => s.grade >= min && s.grade <= max);

        res.statusCode = 200;
        res.end(JSON.stringify(filtered));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  }

  // Not Found
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Endpoint Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
