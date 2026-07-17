import bcrypt from "bcrypt";
import UserAuth from "../models/userAuth.model.js";
import generateToken from "../utils/generateToken.js";

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
