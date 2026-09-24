const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/User");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User data created successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    if (await user.isPasswordSame(password)) {
      res.cookie("loginToken", user.getJWT());
      res.send("Login Successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.get("/logout", async (req, res) => {
  res.clearCookie("loginToken").send("Logout successful");
});

module.exports = authRouter;
