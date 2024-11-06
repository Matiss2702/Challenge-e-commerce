const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  postgresId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN', 'ROLE_COMPTA'],
    default: 'ROLE_USER',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('UserMongo', UserSchema);
