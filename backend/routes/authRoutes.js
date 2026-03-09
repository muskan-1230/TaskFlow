const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req,res)=>{

  try{

    const {
      name,
      email,
      password,
      profession,
      organisationLevel,
      deadlineCompletion,
      usagePurpose
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if(existingUser){
      return res.status(400).json({
        message:"User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      profession,
      organisationLevel,
      deadlineCompletion,
      usagePurpose
    });

    res.status(201).json({
      message:"User registered successfully"
    });

  }
  catch(error){

    console.error(error);
    res.status(500).json({
      message:error.message
    });

  }

});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
