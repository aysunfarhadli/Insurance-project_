const express = require('express');
const router = express.Router();
const authController = require('../controller/authUser');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, (req, res) => {
    // The user is authenticated, and the token payload is available in req.user
    res.json({
        message: 'Welcome to your profile',
        user: req.user // Decoded user info from the token
    });
});

module.exports = router;
