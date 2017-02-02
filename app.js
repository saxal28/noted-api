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

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'http://grave-digger-lorna-16454.netlify.com/');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
