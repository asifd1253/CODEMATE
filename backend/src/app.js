const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("1st response");
    res.send("response from 1st function");
    next();
  },
  [(req, res, next) => {
    console.log("2nd response");
    // res.send("response from 2nd function");
    next();
  },
  (req, res, next) => {
    console.log("3rd response");
    // res.send("response from 3rd function");
    next();
  },
  (req, res, next) => {
    console.log("4th response");
    // res.send("response from 4th function");
    next();
  }],
  (req, res, next) => {
    console.log("5th response");
    // res.send("response from 5th function");
    next();
  },
  (req, res) => {
    console.log("6th response");
    // res.send("reponse form th function");
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
