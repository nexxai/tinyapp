const express = require("express");
const router = express.Router();
const users = require("../dbs/userDatabase");
const urlDatabase = require("../dbs/urlDatabase");

const { generateRandomString, getUser, urlsForUser } = require("../helpers");

router.post("/", (req, res) => {
  const user = getUser("id", req.session.user_id, users);

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_create_new_urls", templateVars);
  }

  const id = generateRandomString();
  const newUrl = {
    userID: user.id,
    longURL: req.body.longURL,
  };

  urlDatabase[id] = newUrl;
  res.redirect(`/urls/${id}`);
});

router.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

router.get("/", (req, res) => {
  const user = getUser("id", req.session.user_id, users);

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  const urls = urlsForUser(user.id, urlDatabase);

  const templateVars = {
    user,
    urls,
  };

  res.render("urls_index", templateVars);
});

router.get("/new", (req, res) => {
  const user = getUser("id", req.session.user_id, users);

  if (!user) {
    res.redirect("/login");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

router.post("/delete/:id", (req, res) => {
  const user = getUser("id", req.session.user_id, users);
  const url = urlDatabase[req.params.id];

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (user.id !== url.userID) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

router.post("/:id", (req, res) => {
  const user = getUser("id", req.session.user_id, users);
  const url = urlDatabase[req.params.id];

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (user.id !== url.userID) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  url.longURL = req.body.url;

  res.redirect("/urls");
});

router.get("/:id", (req, res) => {
  const user = getUser("id", req.session.user_id, users);
  const url = urlDatabase[req.params.id];

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (user.id !== url.userID) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  const templateVars = {
    id: req.params.id,
    longURL: url.longURL,
    user,
  };
  res.render("urls_show", templateVars);
});

module.exports = router;
