const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://asifd1253_db_user:fEVEPWbp3aMJMYYQ@cluster0.jd93cuy.mongodb.net/"+"CODEMATE",
  );
};

module.exports = connectDB;

