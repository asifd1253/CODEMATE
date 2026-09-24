const express = require("express");
const requestRouter = express.Router();

const { authenticateUser } = require("../middlewares/authMiddleware");

requestRouter.post("/sendConRequest", authenticateUser, async (req, res) => {
  const { firstName } = req.user;

  res.send("Request came from " + firstName);
});

module.exports = requestRouter;
