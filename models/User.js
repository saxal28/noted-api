const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = "BACON_SANDWICH";
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  }
})

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports.User = User;
