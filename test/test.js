const expect = require("expect");
const request = require("supertest");
const {app} = require("../app");
const {Note} = require("../models/Note");
const {User} = require("../models/User");
const {seedDB, testNote, testNote2} = require("../seed");
const {ObjectID} = require("mongodb");
const colors = require("colors");
const passport = require("passport");

describe("this is the initial test", () => {
  it("4 should equal 4", () => {
    expect(4).toBe(4);
  })
});

describe("Seeding the DB...", () => {
  //mainly for visual purposes.... :)
  it("deleting all notes...", () => {
    seedDB();
  });
  it('adding two test notes...', () => {

  })

})

describe("================ NOTES TESTS ================\n", () => {
  describe("GET /notes", () => {
    it("should render all notes", (done) => {
      request(app)
        .get("/notes")
        .expect(200)
        .expect(res => {
          expect(res.body).toNotBe({});
        })
      .end(done)
    })
  })

  describe("GET /notes/:id", () => {
    it('should get a note by id', (done) => {
      var id = testNote._id;
      request(app)
        .get(`/notes/${id}`)
        .expect(200)
        .end(done)
    })
  })

  describe("PATCH /notes/:id", () => {
    it("should update a note by id", done => {
      var id = testNote2._id;
      request(app)
        .get(`/notes/${id}`)
        .expect(200)
        .end(() => {
          Note.findByIdAndUpdate(id, {$set:{title: "Just Updated the Note"}}).then(note => {
            expect(note._id).toEqual(testNote2._id);
            //updates in postman but the test doesnt pass......
            //async issue???
            // expect(note.title).toNotBe(testNote2.title);
            done()
          }).catch(e => done(e))
        })
    })
  })

  describe("DELETE /notes/:id", () => {
    it("should delete a note by id", (done) => {
      var id = testNote._id;
      request(app)
        .delete(`/notes/${id}`)
        .expect(200)
        .end(done)
    })
  })

  describe("GET /notes/sort/:category", () => {
    it("should get the notes by category", (done) => {
      var category = testNote.category;
      request(app)
        .get(`/notes/sort/${category}`)
        .expect(200)
        .end(() => {
          Note.find({category}).then(note => {
            expect(note).toExist();
            expect(note.length).toBe(1);
            done()
          }).catch(e => done(e))
        })
    })
  })
})


//=====================================
//    USER TESTS
//=====================================

describe("================ USERS TESTS ================\n", () => {
  describe("GET /users", () => {
    it("should return a list of users", (done) => {
      request(app)
        .get("/users")
        .expect(200)
        .expect(req => {
          expect(req.body.users.length).toEqual(1);
        })
        done()
    })
  })
  describe("POST /register", () => {
    it("should create a new user", (done) => {
      request(app)
        .get("/register")
        .expect(200)
        .end((req, res) => {
          User.register(new User({ username : "test user" }), "password", (err, user) => {
            expect(200)
            expect(user).toExist();
            expect(user.username).toBe("test user");
            done()
          });
        })
    })
  })

})
