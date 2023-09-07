const express = require("express");
const router = express.router();

router.get("/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (!longURL) {
    const templateVars = { user: null };
    res.status(404);
    return res.render("errors/short_url_not_found", templateVars);
  }

  res.redirect(longURL);
});

module.exports = router;
