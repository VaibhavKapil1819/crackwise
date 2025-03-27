const express = require("express");
const router = express.Router();
const { executeCode } = require("../controllers/codeExecutionController");

// Define route for executing code
router.post("/execute", executeCode);

module.exports = router;
