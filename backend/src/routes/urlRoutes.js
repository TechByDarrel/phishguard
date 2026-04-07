const express = require("express");
const router = express.Router();
const { checkUrl, getUrlChecks } = require("../controllers/urlController");

router.get("/check-url", (req, res) => {
  res.send("check-url route is working. Use POST to analyze a URL.");
});

router.post("/check-url", checkUrl);
router.get("/url-checks", getUrlChecks);

module.exports = router;