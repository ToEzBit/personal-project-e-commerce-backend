const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/:productId", commentController.createComment);
router.delete("/:commentId/", commentController.deleteComment);

module.exports = router;
