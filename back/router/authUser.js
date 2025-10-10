const express = require('express');
const router = express.Router();
const authController = require('../controller/authUser');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/authUser'); // <-- make sure path is correct

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Welcome to your profile", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
