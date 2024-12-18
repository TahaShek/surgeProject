const express = require("express");
const {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
} = require("../controller/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
module.exports = router;
