const {Note} = require("./models/Note");
const mongoose = require("mongoose");
const {ObjectID} = require("mongodb");

var notes = [
  {title: "note 1", _id: new ObjectID},
  {title: "note 2", _id: new ObjectID}
]

var testNote = notes[0];
var testNote2 = notes[1];

var seedDB = () => {
  //delete database and reseed
  Note.remove({}).then(() => {
    Note.create(notes).then(() => {
    }).catch(e => console.log(e))
  })
}

module.exports = {
  seedDB,
  testNote,
  testNote2
}
