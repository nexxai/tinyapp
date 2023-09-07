const { assert } = require("chai");
const { getUser, urlsForUser } = require("../helpers");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const testUrlDb = {
  abc123: {
    longURL: "https://www.microsoft.com",
    userID: "userRandomID",
  },
  "123abc": {
    longURL: "https://www.google.com",
    userID: "userRandomID",
  },
  def456: {
    longURL: "https://apple.com",
    userID: "user2RandomID",
  },
};

describe("getUserByEmail", function () {
  it("should return a user with valid email", function () {
    const user = getUser("email", "user@example.com", testUsers);
    const expectedUserID = "userRandomID";

    assert.equal(user.id, expectedUserID);
  });

  it("returns undefined if the email does not exist", function () {
    const user = getUser("email", "does@not.exist", testUsers);

    assert.equal(user, undefined);
  });
});
