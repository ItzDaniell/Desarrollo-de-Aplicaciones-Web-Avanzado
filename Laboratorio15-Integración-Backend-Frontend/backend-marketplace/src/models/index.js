// Central model loader to define associations
const sequelize = require('../config/database')

const Category = require('./category')
const Product = require('./product')

// Associations
Category.hasMany(Product, { foreignKey: 'CategoryId', onDelete: 'SET NULL' })
Product.belongsTo(Category, { foreignKey: 'CategoryId' })

module.exports = {
  sequelize,
  Category,
  Product,
}
