const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const checkAuthToken = require("../middlewares/checkAuthToken");
router.get("/:postId/comments", checkAuthToken ,commentController.getComments);
router.post("/:postId/comments", checkAuthToken,commentController.addComment);
module.exports = router;
