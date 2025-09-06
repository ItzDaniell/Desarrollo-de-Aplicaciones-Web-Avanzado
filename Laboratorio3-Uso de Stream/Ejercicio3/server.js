// Ejercicio3/server.js
// Dependencias necesarias para la actividad
const http = require('http');
const exceljs = require('exceljs');
const { data } = require('./data');

// Puerto donde correrá el servidor
const PORT = 3000;

// Lógica del servidor
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');

    // Ruta para generar y descargar el archivo Excel
    if (req.url === '/reporte') {
        res.statusCode = 200; // Respuesta del servidor
       
        res.setHeader('Content-Disposition', 'attachment; filename="reporte.xlsx"'); // Cabecera para descargar el archivo

        // Crear un nuevo workbook y worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Ventas');

        // Definir las columnas del worksheet
        worksheet.columns = [
            { header: 'Producto', key: 'producto' },
            { header: 'Cantidad', key: 'cantidad' },
            { header: 'Precio', key: 'precio' }
        ];

        // Agregar los datos al worksheet
        data.forEach(item => {
            worksheet.addRow(item);
        });

        // Enviar el archivo Excel como respuesta
        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } else {
        // Ruta no encontrada y dirigir al usuario a la ruta correcta
        res.statusCode = 404;
        res.end('<h1>404 Not Found</h1><p>Visita <a href="/reporte">/reporte</a> para descargar el Excel</p>');
    }
});


// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})