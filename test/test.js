const expect = require("expect");
const request = require("supertest");
const {app} = require("../app");
const {Note} = require("../models/Note");
const {seedDB, testNote, testNote2} = require("../seed");
const {ObjectID} = require("mongodb");
const colors = require("colors");

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
          console.log("updates in postman but the test doesnt pass......".red);
          expect(note.title).toNotBe(testNote2.title);
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
