const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("1st response");
    res.send("response from 1st function");
    next();
  },
  (req, res) => {
    console.log("2nd response");
    res.send("reponse form 2nd function");
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
