import { registerUser, loginUser, logoutUser, forgotPasswordService, resetPasswordService, getProfileService} from "../services/auth.service.js";

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
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

export const resetPassword = async (req, res) => {
    try {

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required."
            });
        }

        const response = await resetPasswordService({
            email,
            otp,
            newPassword
        });

        return res.status(200).json({
            success: true,
            message: response.message
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const response = await forgotPasswordService({email});

        return res.status(200).json({
            success: true,
            message: response.message,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await getProfileService(req.user);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};