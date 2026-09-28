const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/User");

authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    const curUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });

    await curUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: curUser,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const curUser = await User.findOne({ emailId });

    if (!curUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    if (await curUser.isPasswordSame(password)) {
      res.cookie("loginToken", curUser.getJWT());
      res.send(curUser);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("loginToken").send("Logout successful");
});

module.exports = authRouter;
