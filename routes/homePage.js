const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  return res.redirect("/urls");
});

module.exports = router;
