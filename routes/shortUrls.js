const express = require("express");
const router = express.Router();
const urlDatabase = require("../dbs/urlDatabase");

router.get("/:id", (req, res) => {
  const url = urlDatabase[req.params.id];

  if (!url) {
    const templateVars = { user: null };
    res.status(404);
    return res.render("errors/short_url_not_found", templateVars);
  }

  res.redirect(url.longURL);
});

module.exports = router;
