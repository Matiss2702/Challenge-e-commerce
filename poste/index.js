const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

// Connexion à MongoDB
// connectDB();

// Synchronisation de Sequelize avec PostgreSQL
// sequelize.sync();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
