const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { authenticateUser } = require("../middlewares/authMiddleware");
const { validateEditUser } = require("../utils/validate");

profileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  try {
    const curUser = req.user;

    res.send(curUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit", authenticateUser, (req, res) => {
  try {
    const isAllowed = validateEditUser(req);
    if (!isAllowed) {
      throw new Error("Invalid Edit request");
    }
    const curUser = req.user;
    Object.keys(req.body).forEach((key) => (curUser[key] = req.body[key]));
    curUser.save();
    res.status(200).json({
      message: `${curUser.firstName}, your profile updated`,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch(
  "/profile/reset_password",
  authenticateUser,
  async (req, res) => {
    try {
      const { curPassword, newPassword } = req.body;
      const curUser = req.user;

      if (newPassword === curPassword) {
        throw new Error("New Password must be different from previous one");
      }

      const isCurrentPasswordValid = await curUser.isPasswordSame(curPassword);
      if (!isCurrentPasswordValid) {
        throw new Error("Current Password not correct");
      }

      curUser.password = await bcrypt.hash(newPassword, 10);
      curUser.save();

      res.status(200).json({
        message: "Your password was updated successfully",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = profileRouter;
