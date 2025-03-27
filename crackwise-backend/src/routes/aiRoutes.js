const express = require("express");
const { generateFeedback } = require("../controllers/aiController");

const router = express.Router();

router.post("/generate_feedback", generateFeedback);

module.exports = router;
