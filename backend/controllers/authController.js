const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/sequelize');
const User = require('../models/postgres/User')(sequelize);
const UserMongo = require('../models/mongo/UserMongo');
const userSchema = require('../schemas/userSchema');

exports.register = async (req, res) => {
  try {
    console.log('Starting registration process');

    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('Validation error:', validation.error.errors);
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, birthdate, email, password, role } = validation.data;
    console.log(`Received data - Name: ${name}, Birthdate: ${birthdate}, Email: ${email}, Role: ${role}`);

    const parsedBirthdate = new Date(birthdate);
    if (isNaN(parsedBirthdate.getTime())) {
      console.error('Invalid birthdate format');
      return res.status(400).json({ message: 'Invalid birthdate format' });
    }

    let user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`User already exists in PostgreSQL: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const userMongo = await UserMongo.findOne({ email });
    if (userMongo) {
      console.log(`User already exists in MongoDB: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated successfully');
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    user = await User.create({
      name,
      birthdate: parsedBirthdate,
      email,
      password: hashedPassword,
      role,
    });
    console.log(`User created in PostgreSQL: ${user.id}`);

    const newUserMongo = new UserMongo({
      postgresId: user.id,
      name,
      birthdate: parsedBirthdate,
      email,
      password: hashedPassword,
      role,
    });
    await newUserMongo.save();
    console.log(`User created in MongoDB with ID: ${newUserMongo._id}`);

    const payload = {
      user: {
        id: newUserMongo._id.toString(),
        role: user.role,
        birthdate: user.birthdate
      },
    };

    console.log('Creating JWT token');
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Token generated successfully');

    res.status(201).json({ token });
    console.log('Response sent successfully');
  } catch (err) {
    if (err.code === 11000) {
      console.error('Duplicate email error:', err.keyValue.email);
      return res.status(400).json({ message: `User with email ${err.keyValue.email} already exists` });
    }
    console.error(`Error during user registration: ${err.message}`, err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Attempting login for user: ${email}`);
  console.log('Login function called at:', new Date().toISOString());

  if (!email || !password) {
    console.log('Email or password not provided');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    let userMongo = await UserMongo.findOne({ email });
    if (!userMongo) {
      console.log(`User not found in MongoDB: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!userMongo.password) {
      console.log('User password is undefined');
      return res.status(500).json({ message: 'Server error: user data is incomplete' });
    }

    const isMatch = await bcrypt.compare(password, userMongo.password);
    if (!isMatch) {
      console.log(`Invalid credentials for user: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: userMongo._id.toString(),
        role: userMongo.role,
        birthdate: userMongo.birthdate
      },
    };

    if (!process.env.JWT_SECRET) {
      console.error('JWT secret is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Generated token:', token);
    res.json({ token });
  } catch (err) {
    console.error(`Error during login: ${err.message}`, err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMe = async (req, res) => {
  try {
    console.log(`Fetching user info for ID: ${req.user.id}`);

    const user = await UserMongo.findById(req.user.id).select('-password');
    if (!user) {
      console.log(`User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User info retrieved for ID: ${req.user.id}`);
    res.json(user);
  } catch (err) {
    console.error(`Error fetching user info: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};


