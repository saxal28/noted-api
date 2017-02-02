const express = require("express");
const app = express();

const {ObjectID} = require("mongodb");
const {db} = require("./db/db");
const {Note} = require("./models/Note");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const colors = require("colors");

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
  var newNote = new Note({
    title: req.body.title,
    author: req.body.author,
    link: req.body.link,
    summary: req.body.summary,
    body: req.body.body
  })

  newNote.save().then(note => {
    res.send(note)
  }).catch(e => res.status(400).send({}));
})

app.get("/notes/:id", (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({err: "ObjectID is not Valid"});
  }

  Note.findById(id).then(note => {
    if(!note) {
      return res.status(400).send({err: "Note Not Found/Doesnt Exist"})
    }
    res.send(note);
  }).catch(e => res.send({e}));
});

app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({err: "ObjectID is not Valid"});
  }

  Note.findByIdAndRemove(id).then(note => {
    if(!note) {
      return res.status(400).send({err: "Note Not Found/Doesnt Exist"})
    }
    res.send(note);
  }).catch(e => res.send({e}));
})

app.patch("/notes/:id", (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({err: "ObjectID is not Valid"});
  }

  var body = _.pick(req.body, ["title", "summary", "link", "body"]);
  console.log(body)

  Note.findByIdAndUpdate(id, {$set: body}).then(note => {
    res.send(note);
  }).catch(e => res.status(400).send({err: "Unable to Find Note to Update"}));
})

app.listen(PORT, () => {
  console.log(`\nApp started on port ${PORT}\n`.white.bgGreen.bold)
});

//for mocha tests
module.exports = {
  app
}
