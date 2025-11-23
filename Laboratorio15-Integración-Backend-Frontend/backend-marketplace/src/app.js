const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce funcionando' })
})

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
});

module.exports = app