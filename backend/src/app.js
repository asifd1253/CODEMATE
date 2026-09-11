const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validate.js");
const bcrypt = require("bcrypt");

const app = express();

// It is a middleware to run all the time to convert json into JS object
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password:hashedPassword,
    });
    await user.save();
    res.send("User data created successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res)=>{
  try {
    const {emailId,password}=req.body;

    const user=await User.findOne({emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordValid=await bcrypt.compare(password, user.password);
    if(isPasswordValid){
      res.send("Login Successful")
    }else{
      throw new Error("Invalid credentials");
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
})

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
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
    res.send(await User.find({}));
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) => {
      return ALLOWED_UPDATES.includes(key);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfuly.");
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
