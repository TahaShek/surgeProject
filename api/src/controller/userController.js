const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/individualUserSchemma");
const speakeasy = require("speakeasy");
const sendEmail = require("../config/email");

const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, phone } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = speakeasy.totp({
      secret: process.env.JWT_SECRET, 
      encoding: "base32",
    });

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    await user.save();

    await sendEmail(email, "Your OTP for Login", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValidOTP =
      user.otp === otp && user.otpExpiresAt > new Date(Date.now());

    if (!isValidOTP)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Export only once, combining all functions
module.exports = { registerUser, loginUser, sendOTP, verifyOTP };
