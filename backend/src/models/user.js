const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 9,
      max: 80,
    },
    gender: {
      type: String,
      validate: function (value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not supported.");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/-jEdCYfJyeaHlEjKV17YbcXIBU6O08qlFR84iZlQSY8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzkv/MDAyLzkxOC9zbWFs/bC8zZC1kZWZhdWx0/LXVzZXItcHJvZmls/ZS1hdmF0YXItY2ly/Y2xlLWljb24tcG5n/LnBuZw",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is invalid:" + value);
        }
      },
    },
    about: {
      type: String,
      default: function () {
        return `My name is ${this.firstName}, i am a developer.`;
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: (skills) => skills.length <= 50,
        message: "Skills should not exceed 50",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const cookieToken = jwt.sign({ _id: this._id }, "CODEMATE@jwttoken", {
    expiresIn: "1h",
  });
  return cookieToken;
};

userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
