import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import express from "express";
import cors from "cors";
import cloudinary from "../lib/cloudinary.js";

const app = express();

app.use(express.json());
app.use(cors());

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  } catch (err) {
    console.log(err.message);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const user = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
        console.log(req.user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
}