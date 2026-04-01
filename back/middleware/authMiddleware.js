const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // If login is disabled, skip authentication and set a test user
    if (process.env.ENABLE_LOGIN === 'false') {
        req.user = {
            id: "test_user_id",
            email: "test@example.com",
            role: "admin"
        };
        return next();
    }

    const token = req.cookies.token; // cookie-dən götürürük

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
