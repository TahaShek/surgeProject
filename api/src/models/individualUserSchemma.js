const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "individual" },
  otp: { type: String },
  otpExpiresAt: { type: Date },
});

// eslint-disable-next-line no-undef
module.exports = mongoose.model("User", UserSchema);
