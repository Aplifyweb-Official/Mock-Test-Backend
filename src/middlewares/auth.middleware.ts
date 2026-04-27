import jwt from "jsonwebtoken";
import { Session } from "../modules/auth/session.model.js";
export const protect = async (req: any, res: any, next: any) => {

    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        // 🔥 SESSION CHECK
        const session = await Session.findOne({
            userId: decoded.userId,
            token,
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Login again.",
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
        next();
    };
};