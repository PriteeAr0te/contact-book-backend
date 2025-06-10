import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            req.user = decoded.user;
            next();
        } catch (err) {
            console.error("❌ Token verification failed:", err.message);
            res.status(401).json({ message: "Invalid token." });
        }
    } else {
        console.error("❌ No auth header or invalid format.");
        res.status(401).json({ message: "No token provided." });
    }
});


export default validateToken;