const express = require("express");
const connectDB = require("./config/database.js");
const Users = require("./models/users.js");

const app = express();

// It is a middleware to run all the time to convert json into JS object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new Users(req.body);

  try {
    await user.save();
    res.send("User data created successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await Users.find({ emailId: req.body.emailId });
    if (!user) {
      return res.status(404).send("User Not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/fetch", async (req, res) => {
  try {
    res.send(await Users.find({}));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.patch("/user", async(req, res)=>{
  try {
    await Users.findByIdAndUpdate(req.body.userId, req.body);
    res.send("User updated successfuly.");
  } catch (error) {
    res.status(400).send(error.message);
  }
})

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
