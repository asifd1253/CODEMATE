const express = require("express");
const curUserRouter = express.Router();

const { authenticateUser } = require("../middlewares/authenticateUser.js");
const Connect = require("../models/Connect.js");
const User = require("../models/User.js");

const OTHERS_USER_SAFE_DATA =
  "firstName lastName age skills photUrl gender about";

curUserRouter.get(
  "/user/requests/received",
  authenticateUser,
  async (req, res) => {
    try {
      const curUser = req.user;

      const totalRequests = await Connect.find({
        toUserId: curUser._id,
        status: "interested",
      }).populate("fromUserId", OTHERS_USER_SAFE_DATA);

      res.status(200).json({
        message: "These are the total requests",
        apiResult: totalRequests,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

curUserRouter.get("/user/network", authenticateUser, async (req, res) => {
  try {
    const curUser = req.user;

    const totalNetwork = await Connect.find({
      status: "accepted",
      $or: [{ fromUserId: curUser._id }, { toUserId: curUser._id }],
    })
      .populate("fromUserId", OTHERS_USER_SAFE_DATA)
      .populate("toUserId", OTHERS_USER_SAFE_DATA);

    const filteredNetwork = totalNetwork.map((document) => {
      // if i am in the fromUserId then return toUserId person
      if (document.fromUserId._id.equals(curUser._id)) {
        return document.toUserId;
      } else {
        // if i am in the toUserId then return fromUserId person
        return document.fromUserId;
      }
    });

    res.json({
      message: `This is your Network ${curUser.firstName}`,
      apiResult: filteredNetwork,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

curUserRouter.get("/user/feed", authenticateUser, async (req, res) => {
  try {
    const curUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 10 ? 10 : limit;

    const totalConnects = await Connect.find({
      $or: [{ fromUserId: curUser._id }, { toUserId: curUser._id }],
    }).select("fromUserId toUserId");

    const hideInFeed = new Set();

    totalConnects.forEach((connection) => {
      hideInFeed.add(connection.fromUserId.toString());
      hideInFeed.add(connection.toUserId.toString());
    });

    // if no connections are there then self should not be in feeds
    hideInFeed.add(curUser._id.toString());

    const feedUsers = await User.find({
      _id: {
        $nin: [...hideInFeed],
      },
    })
      .select(OTHERS_USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: `This is your ${feedUsers.length} feed user`,
      apiResult: feedUsers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = curUserRouter;
