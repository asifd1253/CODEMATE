const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth.js");

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("User loggedin successful."); 
});

app.get("/user/data", userAuth, (req, res) => {
  res.send("User data send");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Take all data.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
