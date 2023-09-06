const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const uuid = require("uuid");
const PORT = 8080; // default port 8080

const generateRandomString = function () {
  return uuid.v4().substring(0, 6);
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {};

const getUser = function (key, value) {
  for (let userId in users) {
    if (users[userId][key] === value) {
      return users[userId];
    }
  }
};

const redirectToUrlsIfLoggedIn = function (req, res) {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  }
};

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/urls", (req, res) => {
  const user = getUser("id", req.cookies["user_id"]);

  if (!user) {
    const templateVars = { user: null };
    res.status(403);
    return res.render("errors/must_login_to_create_new_urls", templateVars);
  }

  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];

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
  const user = getUser("id", req.cookies["user_id"]);
  const templateVars = {
    user,
    urls: urlDatabase,
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = getUser("id", req.cookies["user_id"]);

  if (!user) {
    res.redirect("/login");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.post("/urls/delete/:id", (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.url;

  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  const user = getUser("id", req.cookies["user_id"]);
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
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

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    name,
    email,
    password,
  };

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  redirectToUrlsIfLoggedIn(req, res);

  const templateVars = { user: null };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = getUser("email", email);

  if (!user) {
    res.status(403);
    return res.send("User not found");
  }

  if (user && password !== user.password) {
    res.status(403);
    return res.send("Password mismatch");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
