const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/:productId", commentController.createComment);

module.exports = router;
