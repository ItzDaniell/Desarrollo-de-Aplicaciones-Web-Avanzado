const express = require('express')
const router = express.Router()
const productoController = require('../controllers/product.controller')

const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productoController.getAllProducts);
router.get('/:id', productoController.getProductById);
router.post('/', verifyToken, isAdmin, productoController.createProduct);
router.put('/:id', verifyToken, isAdmin, productoController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productoController.deleteProduct)

module.exports = router