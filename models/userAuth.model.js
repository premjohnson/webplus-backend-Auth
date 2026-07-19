import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    passwordResetOTP: {
      type: String,
      default: null,
    },

    passwordResetOTPExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const UserAuth = mongoose.model("UserAuth", userAuthSchema);

export default UserAuth;