const { Product, Category } = require('../models')

exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = {};
    if (categoryId) {
      whereClause.CategoryId = categoryId;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['id', 'nombre', 'descripcion'] }]
    });

    const mapped = products.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.description || null,
      imageUrl: p.imageUrl || null,
      CategoryId: p.CategoryId || null,
      Category: p.Category ? { id: p.Category.id, nombre: p.Category.nombre, descripcion: p.Category.descripcion || null } : null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    res.json({
      success: true,
      message: "Productos obtenidos exitosamente",
      data: mapped,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      data: null,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'nombre', 'descripcion'] }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    const mapped = {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.description || null,
      imageUrl: product.imageUrl || null,
      CategoryId: product.CategoryId || null,
      Category: product.Category ? { id: product.Category.id, nombre: product.Category.nombre, descripcion: product.Category.descripcion || null } : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    res.json({
      success: true,
      message: "Producto obtenido exitosamente",
      data: mapped,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      data: null,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, description, categoryId, imageUrl } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son obligatorios",
        data: null,
      });
    }

    if (precio < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio no puede ser negativo",
        data: null,
      });
    }

    // validate category if provided
    if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Categoria no encontrada', data: null });
      }
    }

    const newProduct = await Product.create({ nombre, precio, description, CategoryId: categoryId, imageUrl });

    const prod = await Product.findByPk(newProduct.id, { include: [{ model: Category, attributes: ['id', 'nombre', 'descripcion'] }] });
    const mappedNew = {
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      descripcion: prod.description || null,
      imageUrl: prod.imageUrl || null,
      CategoryId: prod.CategoryId || null,
      Category: prod.Category ? { id: prod.Category.id, nombre: prod.Category.nombre, descripcion: prod.Category.descripcion || null } : null,
      createdAt: prod.createdAt,
      updatedAt: prod.updatedAt,
    };

    res.status(201).json({
      succes: true,
      message: "Producto creado exitosamente",
      data: mappedNew,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      data: null,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, description, categoryId, imageUrl } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
        data: null,
      });
    }

    if (precio && precio < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio no puede ser negativo",
        data: null,
      });
    }

    if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) {
        return res.status(400).json({ success: false, message: 'Categoria no encontrada', data: null });
      }
    }

    await product.update({ nombre, precio, description, CategoryId: categoryId, imageUrl });

    const prod = await Product.findByPk(product.id, { include: [{ model: Category, attributes: ['id', 'nombre', 'descripcion'] }] });
    const mappedUpd = {
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      descripcion: prod.description || null,
      imageUrl: prod.imageUrl || null,
      CategoryId: prod.CategoryId || null,
      Category: prod.Category ? { id: prod.Category.id, nombre: prod.Category.nombre, descripcion: prod.Category.descripcion || null } : null,
      createdAt: prod.createdAt,
      updatedAt: prod.updatedAt,
    };

    res.json({
      succes: true,
      message: "Producto actualizado exitosamente",
      data: mappedUpd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      data: null,
    });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id) 

        if (!product) {
            res.json({
                success: false,
                message: "Producto no encontrado",
                data: null
            });
        }

        await product.destroy();

        res.json({
            success: true,
            message: "Producto eliminado exitosamente",
            data: null
        });
    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error al eliminar el producto",
            data: null
        })
    }
}