const express = require("express");
const app = express();

const {ObjectID} = require("mongodb");
const {db} = require("./db/db");
const {Note} = require("./models/Note");
const {User} = require("./models/User");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const colors = require("colors");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());

// Add coors headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//home route
app.get("/", (req, res) => {
  res.send({
    port: 3000,
    user: 'Alan Sax'
  })
});

//get all notes
app.get("/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.send({notes})
  }).catch(e => res.status(400).send({}))
});

//add note
app.post("/notes", (req, res) => {
  var newNote = new Note({
    title: req.body.title,
    author: req.body.author,
    link: req.body.link,
    summary: req.body.summary,
    body: req.body.body,
    category: req.body.category
  })

  newNote.save().then(note => {
    res.send(note);
  }).catch(e => res.status(400).send({}));
})

//get note by id
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

//sort notes by category
app.get("/notes/sort/:id", (req, res) => {
  const category = req.params.id;

  Note.find({category}).then(notes => {
    if(category !== notes[0].category) {
      return res.status(400).send({err: "Category Not Found/Doesnt Exist"})
    }
    res.send(notes);
  }).catch(e => res.status(404).send({err:"Category Not Found/No Items Exist"}));
});

//delete note by id
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

//update note by id
app.patch("/notes/:id", (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send({err: "ObjectID is not Valid"});
  }

  var body = _.pick(req.body, ["title", "summary", "link", "body", "category", "categories"]);
  console.log(body)

  Note.findByIdAndUpdate(id, {$set: body}).then(note => {
    res.send(note);
  }).catch(e => res.status(400).send({err: "Unable to Find Note to Update"}));
})

//=================================
//      USER AUTHENTICATION
//=================================

//gets a list of usernames
app.get("/users", (req, res) => {
  User.find({}).then(users => {
    if(!users) {
      return res.status(404).send({err: "No Users"})
    }
    var usernames = [];
    users.forEach(user => {
      usernames.push(user.username)
    });
    res.send({users: usernames});
  }).catch(e => res.status(400).send({err : e}))
})

//creates user
app.post('/register', (req, res) => {
    User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
        if (err) {
            return res.status(400).send(err);
        }

        passport.authenticate('local')(req, res, function () {
            res.send({user});
        });
    });
});

//login authentication
app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user
    res.send({user: req.user})
  });

//logout route
app.get("/logout", (req, res) => {
  req.logout();
})

app.listen(PORT, () => {
  console.log(`\nApp started on port ${PORT}\n`.white.bgGreen.bold)
});

//for mocha tests
module.exports = {
  app
}
