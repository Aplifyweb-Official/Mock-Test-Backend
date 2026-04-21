import jwt from "jsonwebtoken";

// 🔐 Protect (check token)
export const protect = (req: any, res: any, next: any) => {
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

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

// 🔥 Authorize (check role)
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