const { assert } = require("chai");
const {
  getUser,
  getUrlsForUser,
  registerNewUser,
  authenticateUser,
  generateRandomString,
} = require("../helpers");

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

describe("#getUserByEmail", function () {
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

describe("#getUrlsForUser", function () {
  it("returns all of the urls for a given user", function () {
    const urls = getUrlsForUser("userRandomID", testUrlDb);

    assert.equal(Object.keys(urls).length, 2);
    assert.isTrue(urls.hasOwnProperty("abc123"));
  });

  it("returns an empty object if the supplied user has no urls", function () {
    const urls = getUrlsForUser("doesNotExist", testUrlDb);

    assert.deepEqual(urls, {});
  });
});

describe("#registerNewUser", function () {
  it("registers a new user and returns its user id", function () {
    const userId = registerNewUser(
      "Bob",
      "test@example.org",
      "examplePassword",
      testUsers
    );

    // Make sure we get a user ID back
    assert.isString(userId);

    // Make sure the user was actually created and stored in the DB
    assert.isTrue(testUsers.hasOwnProperty(userId));
  });
});

describe("#authenticateUser", function () {
  it("returns the user object if successfully logged in", function () {
    registerNewUser("Bob", "test@example.org", "examplePassword", testUsers);

    const user = authenticateUser(
      "test@example.org",
      "examplePassword",
      testUsers
    );

    assert.isObject(user);
    assert.equal(user.name, "Bob");
  });
});

describe("#generateRandomString", function () {
  it("returns 6 random characters upon each call", function () {
    const str1 = generateRandomString();
    const str2 = generateRandomString();
    const str3 = generateRandomString();

    assert.equal(str1.length, 6);
    assert.equal(str2.length, 6);
    assert.equal(str3.length, 6);
    assert.notEqual(str1, str2);
    assert.notEqual(str3, str2);
    assert.notEqual(str3, str1);
  });
});
