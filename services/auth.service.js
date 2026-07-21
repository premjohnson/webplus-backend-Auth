import bcrypt from "bcrypt";
import crypto from "crypto";

import UserAuth from "../models/userAuth.model.js";
import generateToken from "../utils/generateToken.js";
import { generateOTP } from "../utils/generateOTP.js";
import {
    sendMail,
    forgotPasswordTemplate,
} from "../utils/generateMail.js";

export const registerUser = async ({ username, email, password }) => {

    const existingUser = await UserAuth.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserAuth.create({
        username,
        email,
        password: hashedPassword,
    });


    const token = generateToken(user._id);

    return {
        user,
        token,
    };
};
export const loginUser = async ({ email, password }) => {

    // Find user by email
    const user = await UserAuth.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Remove password before returning
    const userObject = user.toObject();
    delete userObject.password;

    return {
        user: userObject,
        token,
    };
};


export const logoutUser = async () => {
    return {
        message: "Logout successful",
    };
};

export const forgotPasswordService = async ({ email }) => {

    const user = await UserAuth.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP before storing
    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.passwordResetOTP = hashedOTP;

    user.passwordResetOTPExpires = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save();
    const updatedUser = await UserAuth.findById(user._id);
    //if you want we uncomment 
    // console.log("SAVED USER");
    // console.log(updatedUser);
    // console.log("OTP:", updatedUser.passwordResetOTP);
    // console.log("Expires:", updatedUser.passwordResetOTPExpires);
    

        await sendMail({
            to: user.email,
            subject: "Password Reset OTP",
            html: forgotPasswordTemplate({
                username: user.username,
                otp,
            }),
        });

    return {
        message: "OTP sent successfully to your email.",
    };
};

export const resetPasswordService = async ({
    email,
    otp,
    newPassword,
}) => {

    const user = await UserAuth.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.passwordResetOTP ||!user.passwordResetOTPExpires) {
        throw new Error("No password reset request found.");
    }

    if (user.passwordResetOTPExpires < new Date()) {
        throw new Error("OTP has expired.");
    }

    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    if (hashedOTP !== user.passwordResetOTP) {
        throw new Error("Invalid OTP.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear OTP
    user.passwordResetOTP = null;
    user.passwordResetOTPExpires = null;

    await user.save();

    return {
        message: "Password reset successful.",
    };
};

export const getProfileService = async (user) => {
    return user;
};
