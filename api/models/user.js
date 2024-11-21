const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  admin: {type: Boolean, required: true, default: false},
});

const User = mongoose.model('user', UserSchema);

module.exports = User;