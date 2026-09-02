import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Authentication token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_URI);
        req.user = {
            ...decoded,
            id: decoded.id || decoded._id,
            _id: decoded._id || decoded.id,
        };

        next();
    } catch (error) {
        console.log("Auth Middleware Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}