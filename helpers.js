const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const getUsersDb = require("./dbs/userDatabase");

const getUser = function (key, value, usersDb) {
  for (let userId in usersDb) {
    if (usersDb[userId][key] === value) {
      return usersDb[userId];
    }
  }
};

const getCurrentUser = function (req, res, next) {
  const userId = req.session.user_id;
  const user = getUsersDb[userId];

  req.user = user;

  next();
};

const getUrlsForUser = function (userId, urlsDb) {
  let urls = {};

  for (let url in urlsDb) {
    if (urlsDb[url].userID === userId) {
      urls[url] = urlsDb[url];
    }
  }

  return urls;
};

const registerNewUser = function (name, email, password, usersDb) {
  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  usersDb[userId] = {
    id: userId,
    name,
    email,
    password: hashedPassword,
  };

  return userId;
};

const authenticateUser = function (email, password, usersDb) {
  const user = getUser("email", email, usersDb);

  if (!user) {
    return "user_not_found";
  }

  // We know we have an existing user
  const correctPassword = bcrypt.compareSync(password, user.password);

  if (!correctPassword) {
    return "invalid_password";
  }

  return user;
};

const generateRandomString = function () {
  return uuid.v4().substring(0, 6);
};

module.exports = {
  authenticateUser,
  generateRandomString,
  getCurrentUser,
  getUser,
  getUrlsForUser,
  registerNewUser,
};
