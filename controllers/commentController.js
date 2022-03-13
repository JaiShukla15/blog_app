const { db } = require("../db");
module.exports = {
  addComment: async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "postId is missing" });
    }
    if (!comment) {
      return res.status(400).json({ message: "comment is missing" });
    }
    const addedComment = await db.comments.create({
      comment,
      postId,
      userId: req.session['user'].userId,
    });
    res.json({ message: "Comment Added Successfully",result:addedComment });
  },
  getComments: async (req, res) => {
    const { postId } = req.params;
    const comments = await db.comments.findAll({
      where: {
        postId,
      },
    });
    res
      .status(200)
      .json({ message: "Comments fetched Successfully", result: comments });
  },
};
