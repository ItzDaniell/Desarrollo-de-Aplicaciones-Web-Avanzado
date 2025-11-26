const express = require('express')
const cors = require('cors')
const productsRouter = require('./routes/products')
const authRoutes = require('./routes/authRoutes');
const categoriesRouter = require('./routes/categories');

const app = express()

// Update CORS to allow Vercel frontend
app.use(cors({
    origin: '*', // For development/demo. In production, replace with specific Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use('/api/products', productsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API E-commerce funcionando' })
})

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
});

module.exports = app