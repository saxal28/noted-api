const {Note} = require("./models/Note");
const {User} = require("./models/User");
const mongoose = require("mongoose");
const {ObjectID} = require("mongodb");

//=========================================
//      SEED THE DATABASE FOR TESTING
//=========================================

var notes = [
  {title: "note 1", _id: new ObjectID, category:"Random"},
  {title: "note 2", _id: new ObjectID, category:"Random"}
]

var testNote = notes[0];
var testNote2 = notes[1];

var seedDB = () => {
  //delete database and reseed
  Note.remove({}).then(() => {
    Note.create(notes).then(() => {
    }).catch(e => console.log(e))
  })
  User.remove({}).then(() => {
    User.create({username: "MantisTobagganMD", password: "1234"}).then(() => {
    }).catch(e => console.log(e))
  })
}

module.exports = {
  seedDB,
  testNote,
  testNote2
}
