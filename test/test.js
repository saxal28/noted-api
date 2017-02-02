const expect = require("expect");
const request = require("supertest");
const {app} = require("../app");

describe("this is the initial test", () => {
  it("4 should equal 4", () => {
    expect(4).toBe(4);
  })
});

describe("GET /posts", () => {
  it("it should render a list of posts", (done) => {
    request(app)
    .get("/notes")
    .expect(200)
    .then(res => {
      console.log(res.body);
      expect(res.body).toBe(2);
    }).catch(e => console.log(e))
    done();
  })
})
