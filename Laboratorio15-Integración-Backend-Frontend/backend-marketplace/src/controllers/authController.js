const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get CUSTOMER role (create if not exists for safety, though seeding is better)
    let customerRole = await Role.findOne({ where: { name: 'CUSTOMER' } });
    if (!customerRole) {
      customerRole = await Role.create({ name: 'CUSTOMER' });
    }

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      RoleId: customerRole.id,
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: Role 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.Role.name },
      process.env.JWT_SECRET || 'secret_key', // Use env var in production
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.Role.name 
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
