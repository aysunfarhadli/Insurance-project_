const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/authUser');

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  surname: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10).max(15).pattern(/^(?:\+994|0)(?:10|50|51|55|60|70|77|99)[0-9]{7}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

// ✅ Schema for update (no field required)
const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  surname: Joi.string().min(2).max(100),
  phone: Joi.string().min(10).max(15).pattern(/^(?:\+994|0)(?:10|50|51|55|60|70|77|99)[0-9]{7}$/),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(20),
}).min(1); // At least one field required

// ========================== REGISTER ==========================
exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, surname, phone, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = new User({ name, surname, phone, email, password });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { email: user.email, name: user.name, surname: user.surname },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ========================== LOGIN ==========================
exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );

  // For cross-origin requests (production), use sameSite: "none" and secure: true
  // For same-origin (local development), use sameSite: "strict" and secure: false
  const isProduction = process.env.NODE_ENV === 'production' || req.get('origin')?.includes('vercel.app');
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // true for HTTPS (production), false for HTTP (local)
    sameSite: isProduction ? "none" : "strict", // "none" for cross-origin, "strict" for same-origin
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({ 
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone
    }
  });
};

// ========================== UPDATE (PUT) ==========================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
