const express = require("express");

const app = express();

// if we have err in out callback function then the path / will ignored
app.use("/", (err, req, res, next) => {
  // console.log(err);
  // if (err) {
  //   res.status(500).send("something went wrong");
  // }
  res.send("response from use path");
});
app.get("/getUserData", (req, res, next) => {
  throw new Error("dlflsdjflkj");
  res.send("User data send");
});
app.use("/", (err, req, res, next) => {
  // console.log(err);
  if (err) {
    res.status(500).send("something went wrong");
  }
  res.send("response from use path");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
