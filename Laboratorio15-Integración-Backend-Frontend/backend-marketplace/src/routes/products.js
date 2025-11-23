const express = require('express')
const router = express.Router()
const productoController = require('../controllers/product.controller')

router.get('/', productoController.getAllProducts);
router.get('/:id', productoController.getProductById);
router.post('/', productoController.createProduct);
router.put('/:id', productoController.updateProduct);
router.delete('/:id', productoController.deleteProduct)

module.exports = router