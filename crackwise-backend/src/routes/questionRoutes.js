const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");


// Define routes (No JWT authentication)
router.get("get/{all}", questionController.getAllQuestions);
router.post("/create", questionController.createQuestion);
router.get("/:id", questionController.getQuestionById);


router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
