const express = require("express");
const router = express.Router();
const users = require("../dbs/userDatabase");

const { authenticateUser, getUser, registerNewUser } = require("../helpers");

router.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/urls");
  }

  const templateVars = { user: null };
  return res.render("register", templateVars);
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const templateVars = { user: null };

  if (!email || !password || !name) {
    res.status(400);
    return res.render("./errors/auth/missing_field", templateVars);
  }

  if (getUser("email", email, users)) {
    res.status(400);
    return res.render("./errors/auth/email_already_exists", templateVars);
  }

  const userId = registerNewUser(name, email, password, users);

  req.session.user_id = userId;
  return res.redirect("/urls");
});

router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/urls");
  }

  const templateVars = { user: null };
  return res.render("login", templateVars);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = authenticateUser(email, password, users);
  const templateVars = { user: null };
  if (user === "user_not_found") {
    res.status(403);
    return res.render("./errors/auth/unknown_user", templateVars);
  }

  if (user === "invalid_password") {
    res.status(403);
    return res.render("./errors/auth/invalid_password", templateVars);
  }

  req.session.user_id = user.id;
  return res.redirect("/urls");
});

router.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/login");
});

module.exports = router;
