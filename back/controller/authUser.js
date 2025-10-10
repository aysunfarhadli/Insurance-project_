const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/authUser');
// const SECRET_KEY = process.env.SECRET_KEY; // From .env

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    surname: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(10).max(15).pattern(/^(?:\+994|0)(?:10|50|51|55|60|70|77|99)[0-9]{7}$/ ).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
});

// Register new user with validation
exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, surname, phone, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = new User({
            name,
            surname,
            phone,
            email,
            password
        });

        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: { email: user.email, name: user.name, surname: user.surname }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// Login user with validation
// Login user with validation
exports.login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email }, 
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    // Send token in a cookie instead of JSON
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,         // production-da true + https
        sameSite: "strict",
        maxAge: 60 * 60 * 1000 // 1 saat
    });

    res.json({ message: "Login successful" });
};
