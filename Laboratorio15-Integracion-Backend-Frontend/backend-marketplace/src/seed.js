const sequelize = require('./config/database');
const { Role, User, Category, Product } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.sync({ force: false }); // Don't drop tables if they exist

    // Roles
    const [adminRole] = await Role.findOrCreate({ where: { name: 'ADMIN' } });
    const [customerRole] = await Role.findOrCreate({ where: { name: 'CUSTOMER' } });

    // Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        password: adminPassword,
        RoleId: adminRole.id,
      },
    });

    // Customer User
    const customerPassword = await bcrypt.hash('customer123', 10);
    await User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        password: customerPassword,
        RoleId: customerRole.id,
      },
    });

    // Categories
    const [techCat] = await Category.findOrCreate({ where: { nombre: 'Tecnología' } });
    const [homeCat] = await Category.findOrCreate({ where: { nombre: 'Hogar' } });

    // Products
    await Product.findOrCreate({
      where: { nombre: 'Laptop Gamer' },
      defaults: {
        precio: 1500.00,
        description: 'Laptop potente para juegos',
        CategoryId: techCat.id,
        imageUrl: 'https://via.placeholder.com/300'
      }
    });

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
