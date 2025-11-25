const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const category = await Category.create({ nombre, descripcion });
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
    });
  }
};
