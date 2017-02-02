const express = require("express");
const app = express();

const {db} = require("./db/db");
const { Note } = require("./models/Note");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({
    port: 3000,
    user: 'Alan Sax'
  })
});

app.get("/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.send({notes})
  }).catch(e => res.status(400).send({}))
});

app.post("/notes", (req, res) => {
  console.log(req.body ? true : false)
  var newNote = new Note({
    title: req.body.title,
    author: req.body.author,
    link: req.body.link,
    summary: req.body.summary,
    body: req.body.body
  })

  newNote.save().then(note => {
    console.log(note)
    res.send(note)
  }).catch(e => res.status(400).send({}));
})

// app.get("/notes/:id", (req, res) => {
//
// })

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`)
});


//for mocha tests
module.exports = {
  app
}
