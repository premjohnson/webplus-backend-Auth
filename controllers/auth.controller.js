import { registerUser, loginUser, logoutUser } from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email and password",
            });
        }

        const { user, token } = await registerUser({
            username,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const { user, token } = await loginUser({
            email,
            password,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            token,
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message,
        });

    }
};

export const logout = async (req, res) => {
    try {

        const response = await logoutUser();

        res.status(200).json({
            success: true,
            message: response.message,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

