const { Op } = require("sequelize");
const { db } = require("../db");
const { createError } = require("../errors/customError");
const asyncHandler = require("../middlewares/asyncHandler");
module.exports = {
  addPost: asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    if (!title || !description) {
      return next(createError("Please provide title and description", 409));
    }
    let loggedInUserId = req.session["user"]["userId"];
    const newPost = await db.posts.create({
      title,
      description,
      user_id: loggedInUserId,
    });
    if (newPost)
      return res
        .status(201)
        .json({ result: newPost, message: "Post Created Successfully" });
  }),
  editPost: asyncHandler(async (req, res, next) => {
    const { id: postId } = req.params;
    const { title, description } = req.body;
    if (!title) {
      return next(createError("Please provide title", 409));
    }
    if (!description) {
      return next(createError("Please provide description", 409));
    }
    const savedPost = await db.posts.update(
      {
        title: title,
        description: description,
      },
      {
        where: {
          id: postId,
          user_id: req["session"].user.userId,
        },
      }
    );
    if (!savedPost) {
      throw createError("Post not found", 404);
    }
    res.json({ message: "Post updated successfully", result: savedPost });
  }),
  myPosts: asyncHandler(async (req, res) => {
    const posts = await db.posts.findAll({
      where: {
        user_id: req.session["user"]["userId"],
      },
      include: [
        {
          model: db.user,
          attributes: [["id", "userId"], "name", "email"],
        },
        {
          model: db.comments,
          attributes:["userId",'comment','updatedAt']
        },
      ],
    });
    res.json({ result: posts });
  }),
  getAllPosts: asyncHandler(async (req, res) => {
    console.log(req.session);
    const posts = await db.posts.findAll({
      include: [
        {
          model: db.comments,
        },
      ],
    });
    res.json({ result: posts });
  }),
  deletePost: asyncHandler(async (req, res, next) => {
    const { id: postId } = req.params;
    console.log(req.session);
    const post = await db.posts.destroy({
      where: {
        id: {
          [Op.eq]: postId,
        },
        user_id: req.session.user.userId,
      },
    });
    if (post) {
      return res.json({ success: true, message: "Post Deleted Successfully" });
    }
    next(createError("Post Not Found", 404));
  }),
};
