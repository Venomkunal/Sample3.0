const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConnection = require('../utils/authdb');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true 
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'vendor', 'customer'],
    default: 'customer',
  },
}, {
  timestamps: true // adds createdAt and updatedAt
});

// 🔐 Hash password before saving
userSchema.pre("save", async function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Generate JWT method
userSchema.methods.generateToken = async function () {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }

  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      role: this.role, // ✅ use role, not isAdmin
    },
    process.env.SECRET_KEY,
    { expiresIn: '30d' }
  );
};

const User = authConnection.model('User', userSchema)
module.exports = User;
