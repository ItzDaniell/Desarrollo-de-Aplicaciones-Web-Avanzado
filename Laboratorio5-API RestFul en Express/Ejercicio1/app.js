const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./Middlewares/errorHandler');

const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

// Middleware
app.use(express.json()); // Enviar y recibir JSON
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use(morgan("dev")); // Detalles de la petición en consola
app.use(errorHandler); // Manejo de errores

// Mensaje de prueba
app.get('/', (req, res) => {
    res.send('API RestFul con Express');
})

app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})