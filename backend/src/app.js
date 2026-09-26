const express = require("express");
const app = express();

const connectDB = require("./config/connectDB.js");
const cookieParser = require("cookie-parser");

// It is a middleware to run all the time to convert json into JS object
app.use(express.json());
app.use(cookieParser());

const authRouter = require("../src/routes/authRouter.js");
const profileRouter = require("../src/routes/profileRouter.js");
const requestRouter = require("../src/routes/requestRouter.js");
const curUserRouter = require("./routes/curUserRouter.js");

app.use("/", authRouter, profileRouter, requestRouter, curUserRouter);

connectDB()
  .then(() => {
    console.log("Connection successfully established...");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot connected!!!");
  });
