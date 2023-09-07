const express = require("express");
const router = express.Router();
const { getUser } = require("../helpers");
const userDatabase = require("../dbs/userDatabase");

router.get("/", (req, res) => {
  const user = getUser("id", req.session.user_id, userDatabase);

  if (!user) {
    res.redirect("/login");
  }

  res.redirect("/urls");
});

module.exports = router;
