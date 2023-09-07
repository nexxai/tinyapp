const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const getUser = function (key, value, usersDb) {
  for (let userId in usersDb) {
    if (usersDb[userId][key] === value) {
      return usersDb[userId];
    }
  }
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

const redirectToUrlsIfLoggedIn = function (req, res) {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
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

const authenticateUser = function (email, password, usersDb, res) {
  const user = getUser("email", email, usersDb);

  const templateVars = { user: null };
  if (!user) {
    res.status(403);
    return res.render("./errors/auth/unknown_user", templateVars);
  }

  const correctPassword = bcrypt.compareSync(password, user.password);

  if (user && !correctPassword) {
    res.status(403);
    return res.render("./errors/auth/invalid_password", templateVars);
  }

  return user;
};

const generateRandomString = function () {
  return uuid.v4().substring(0, 6);
};

module.exports = {
  authenticateUser,
  generateRandomString,
  getUser,
  getUrlsForUser,
  registerNewUser,
  redirectToUrlsIfLoggedIn,
};
