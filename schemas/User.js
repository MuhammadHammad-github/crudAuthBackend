const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already Registered"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: 5,
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
