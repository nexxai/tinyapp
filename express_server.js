const express = require("express");
const cookieSession = require("cookie-session");
const urlRoutes = require("./routes/urls");
const shortUrlRoutes = require("./routes/shortUrls");
const authRoutes = require("./routes/auth");
const homePage = require("./routes/homePage");

const app = express();
const PORT = 8080; // default port 8080

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

// Include the routes from the files in ./routes
app.use(homePage);
app.use(authRoutes);
app.use("/urls", urlRoutes);
app.use("/u", shortUrlRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
