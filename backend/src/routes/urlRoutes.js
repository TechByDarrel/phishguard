const express = require("express");
const router = express.Router();
const { checkUrl, getUrlChecks } = require("../controllers/urlController");

router.post("/check-url", checkUrl);
router.get("/url-checks", getUrlChecks);

module.exports = router;