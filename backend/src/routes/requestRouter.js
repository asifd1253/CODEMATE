const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConRequest", userAuth, async (req, res) => {
  const { firstName } = req.user;

  res.send("Request came from " + firstName);
});

module.exports = requestRouter;
