const express = require("express");
const User = require("../schemas/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const securityKey = "1sdf3453fg456dflkgb4564950tfglkjre59068";

// Get user by token
router.get("/user", async (req, res) => {
  try {
    const authToken = req.headers["authToken"] || req.headers["authtoken"];
    if (!authToken)
      return res.status(401).json({ message: "Token Not Received" });
    const { id } = jwt.verify(authToken, securityKey);
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid Token!" });

    res.status(200).json({ message: "User found!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while getting user" });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    const newUser = await User.create({ ...data, password: hash });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);

    // Handle duplicate email error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }

    const token = jwt.sign({ id: user._id }, securityKey);

    res
      .status(200)
      .json({ message: "Logged in successfully!", authToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during logging in" });
  }
});

// Update Password
router.put("/updatePassword", async (req, res) => {
  try {
    const { email, password, updatedPassword } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(updatedPassword, salt);
    const updatedUser = await User.findOneAndUpdate(user._id, {
      password: hash,
    });
    res.status(200).json({ message: "Password Updated Successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating password" });
  }
});
module.exports = router;
