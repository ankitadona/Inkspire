const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const newUser = await userModel.findOne({ email });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    
    res.status(200).json({ message: "Logout Successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { registerUser, login, logout, getUser };
