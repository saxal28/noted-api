var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  author: {
    type: String,
    default: "Anon"
  },
  link: String,
  summary: {
    type: String,
    default: "Looks like I can't follow directions!"
  },
  body: String,
  date: {
    type: Date,
    default: Date.now()
  }
})

var Note = mongoose.model("Note", noteSchema);

module.exports.Note = Note;
