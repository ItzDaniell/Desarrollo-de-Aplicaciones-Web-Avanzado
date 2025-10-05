import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import seedRoles from "./utils/seedRoles.js";
import mainRoutes from "./routes/main.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Habilitar CORS para todos
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Archivos estáticos (css, js, imgs)

// Rutas
app.use("/", mainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Validar estado del servidor
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(async () => {
    console.log("Mongo connected");
    await seedRoles();
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al conectar con Mongo:", err);
    process.exit(1);
});

app.use((req, res) => {
  res.status(404).render("404", {
    message: "La página que buscas no existe o fue movida.",
  });
});
