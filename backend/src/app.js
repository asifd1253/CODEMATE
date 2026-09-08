const express = require("express");
const connectDB = require("./config/database.js");
const Users = require("./models/users.js");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new Users({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "kohli@gmail.com",
    password: "kohli@123",
  });

  try {
    await user.save();
    res.send("User data created successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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
