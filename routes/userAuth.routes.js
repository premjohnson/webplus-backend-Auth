import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getProfile
} from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protectRoute, getProfile);

export default router;