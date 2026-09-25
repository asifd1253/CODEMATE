const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authenticateUser = async (req, res, next) => {
  try {
    const { loginToken } = req.cookies;
    if (!loginToken) {
      throw new Error("Cookies expired login again...");
    }
    const decodedValue = jwt.verify(loginToken, "CODEMATE@jwttoken");

    const { _id } = decodedValue;

    const user = await User.findById({ _id });
    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { authenticateUser };
