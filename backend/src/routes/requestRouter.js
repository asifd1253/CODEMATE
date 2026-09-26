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

requestRouter.post(
  "/request/review/:status/:requestId",
  authenticateUser,
  async (req, res) => {
    try {
      const curUser = req.user;

      const isStatusAllowed = ["accepted", "rejected"].includes(
        req.params.status,
      );
      if (!isStatusAllowed) {
        return res
          .status(400)
          .json({ message: "Staus invalid please give appropriate status" });
      }

      const connectRequest = await Connect.findOne({
        toUserId: curUser._id,
        _id: req.params.requestId,
        status: "interested",
      });

      if (!connectRequest) {
        return res
          .status(404)
          .json({ message: "Connection not found please try again" });
      }

      connectRequest.status = req.params.status;

      const resultData = await connectRequest.save();

      res.status(200).json({
        message: "Request Accepted check the request document",
        resultData: resultData,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
);

module.exports = requestRouter;
