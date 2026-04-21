// Handles req & res
import { createUser, findUserByEmail } from "../users/user.service.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.ts";

export const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // create user
        const user = await createUser({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }


};

export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 🔥 generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};