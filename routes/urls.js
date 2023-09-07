const express = require("express");
const router = express.Router();
const urlDatabase = require("../dbs/urlDatabase");

const { generateRandomString, getUrlsForUser } = require("../helpers");

router.post("/", (req, res) => {
  const user = req.user;

  if (!user) {
    const templateVars = { user };
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
  const user = req.user;

  if (!user) {
    const templateVars = { user };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  const urls = getUrlsForUser(user.id, urlDatabase);

  const templateVars = {
    user,
    urls,
  };

  res.render("urls_index", templateVars);
});

router.get("/new", (req, res) => {
  const user = req.user;

  if (!user) {
    res.redirect("/login");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

router.delete("/delete/:id", (req, res) => {
  const user = req.user;
  const url = urlDatabase[req.params.id];

  if (!user) {
    const templateVars = { user };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (user.id !== url.userID) {
    const templateVars = { user };
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

router.put("/:id", (req, res) => {
  const user = req.user;
  const url = urlDatabase[req.params.id];

  if (!user) {
    const templateVars = { user };
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (user.id !== url.userID) {
    const templateVars = { user };
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  url.longURL = req.body.url;

  res.redirect("/urls");
});

router.get("/:id", (req, res) => {
  const user = req.user;
  const url = urlDatabase[req.params.id];

  let templateVars = { user };
  if (!user) {
    res.status(403);
    return res.render("errors/must_login_to_see_urls", templateVars);
  }

  if (!url) {
    res.status(403);
    return res.render("errors/short_url_not_found", templateVars);
  }

  if (user.id !== url.userID) {
    res.status(403);
    return res.render("errors/can_only_view_own_urls", templateVars);
  }

  templateVars = {
    id: req.params.id,
    longURL: url.longURL,
    user,
  };
  res.render("urls_show", templateVars);
});

module.exports = router;
