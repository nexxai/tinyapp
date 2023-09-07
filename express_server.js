// Web server packages
const express = require("express");
const cookieSession = require("cookie-session");

// Routes
const urlRoutes = require("./routes/urls");
const shortUrlRoutes = require("./routes/shortUrls");
const authRoutes = require("./routes/auth");
const homePage = require("./routes/homePage");

// Helper functions
const { getCurrentUser } = require("./helpers");

// Create the server
const app = express();
const PORT = 8080; // default port 8080

// Use the EJS view engine
app.set("view engine", "ejs");

// MIDDLEWARE

// Access body contents with `req.body`
app.use(express.urlencoded({ extended: true }));

// Encrypt the cookies to prevent tampering
app.use(
  cookieSession({
    name: "session",
    keys: [
      "8d9ec416-a05c-45e3-a48d-2d75dfeb3102",
      "d945dfc1-7def-479d-ae92-79ae13679c24",
    ],
  })
);

// Get the details of the current user for the header partial
app.use(getCurrentUser);

// Include the routes from the files in ./routes
app.use(homePage);
app.use(authRoutes);
app.use("/urls", urlRoutes);
app.use("/u", shortUrlRoutes);

// Enable the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
