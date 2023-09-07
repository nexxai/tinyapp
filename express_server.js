const express = require("express");
const cookieSession = require("cookie-session");
const {
  authenticateUser,
  generateRandomString,
  getUser,
  urlsForUser,
  registerNewUser,
  redirectToUrlsIfLoggedIn,
} = require("./helpers");

const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {};

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: [
      "8d9ec416-a05c-45e3-a48d-2d75dfeb3102",
      "d945dfc1-7def-479d-ae92-79ae13679c24",
    ],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.post("/urls", (req, res) => {
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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (!longURL) {
    const templateVars = { user: null };
    res.status(404);
    return res.render("errors/short_url_not_found", templateVars);
  }

  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
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

app.get("/urls/new", (req, res) => {
  const user = getUser("id", req.session.user_id, users);

  if (!user) {
    res.redirect("/login");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.post("/urls/delete/:id", (req, res) => {
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

app.post("/urls/:id", (req, res) => {
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

app.get("/urls/:id", (req, res) => {
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  redirectToUrlsIfLoggedIn(req, res);

  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
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

app.get("/login", (req, res) => {
  redirectToUrlsIfLoggedIn(req, res);

  const templateVars = { user: null };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = authenticateUser(email, password, users);

  req.session.user_id = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
