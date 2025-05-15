const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password stored in plain text (Not secure)
});

const User = mongoose.model("accounts", UserSchema);
module.exports = User;
