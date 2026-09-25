const express = require("express");
const requestRouter = express.Router();

const { authenticateUser } = require("../middlewares/authenticateUser.js");
const Connect = require("../models/Connect.js");
const User = require("../models/User.js");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authenticateUser,
  async (req, res) => {
    try {
      const curUser = req.user;

      const fromUserId = curUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (!["ignore", "interested"].includes(status)) {
        return res.status(400).json({
          message: "Bad status sended",
        });
      }

      if (!(await User.findById(toUserId))) {
        return res.status(400).json({
          message: "User not present in database",
        });
      }

      const existingConnection = await Connect.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Connect Request already present",
        });
      }

      const newConnection = new Connect({
        fromUserId,
        toUserId,
        status,
      });

      const savedConnection = await newConnection.save();

      res.status(201).json({
        message: savedConnection,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
);

module.exports = requestRouter;
