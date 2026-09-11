const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
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
    },
    about: {
      type: String,
      default: function () {
        return `My name is ${this.firstName}, i am a developer.`;
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
