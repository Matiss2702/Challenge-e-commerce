const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const sequelize = require('./config/sequelize');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const shippingRoutes = require('./routes/shippingRoutes');

dotenv.config();

// Connexion à MongoDB
connectDB();

// Synchronisation de Sequelize avec PostgreSQL
// sequelize.sync();

const app = express();

app.use(express.json());

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shippingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
