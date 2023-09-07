const express = require("express");
const router = express.Router();
const users = require("../dbs/userDatabase");

const {
  authenticateUser,
  getUser,
  registerNewUser,
  redirectToUrlsIfLoggedIn,
} = require("../helpers");

router.get("/register", (req, res) => {
  redirectToUrlsIfLoggedIn(req, res);

  const templateVars = { user: null };
  res.render("register", templateVars);
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    return res.send(`Name, email and password values are all required`);
  }

  if (getUser("email", email)) {
    res.status(400);
    return res.send(`User with email ${email} already exists`);
  }

  const userId = registerNewUser(name, email, password, users);

  req.session.user_id = userId;
  res.redirect("/urls");
});

router.get("/login", (req, res) => {
  redirectToUrlsIfLoggedIn(req, res);

  const templateVars = { user: null };
  res.render("login", templateVars);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = authenticateUser(email, password, users, res);

  req.session.user_id = user.id;
  res.redirect("/urls");
});

router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

module.exports = router;
