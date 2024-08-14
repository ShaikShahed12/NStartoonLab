const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: { type: String, enum: ['User', 'Admin'], default: 'User' } // Enforce valid values
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", userDetailsSchema);
