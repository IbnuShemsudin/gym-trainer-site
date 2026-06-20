const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    let token = req.header("Authorization") || req.header("x-auth-token");

    console.log("RAW TOKEN:", token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token received"
        });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    console.log("TOKEN AFTER CLEANING:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED TOKEN:", decoded);

        req.user = decoded.user;
        next();

    } catch (err) {
        console.log("JWT ERROR NAME:", err.name);
        console.log("JWT ERROR MESSAGE:", err.message);

        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};