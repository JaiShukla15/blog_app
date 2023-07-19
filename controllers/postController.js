const { Op, Sequelize } = require("sequelize");
const { db, redisClient } = require("../db");
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
    if (newPost) {
      const query = {
        include: [
          {
            model: db.comments,
            attributes: [["id", "commentId"], "userId", "comment", "createdAt"],
          },
          {
            model: db.likes,
            attributes: ["user_id", "post_id"],
            include: [
              {
                model: db.user,
                attributes: [["id", "userId"], "name"],
              },
            ],
          },
        ],
      };
      await redisClient.set(query, null);
      return res
        .status(201)
        .json({ result: newPost, message: "Post Created Successfully" });
    }

  }),
  editPost: asyncHandler(async (req, res, next) => {
    const { id: postId } = req.params;
    const { title, description } = req.body;
    let foundPost = await db.posts.findOne({
      where: {
        id: postId,
        user_id: req["session"].user.userId
      }
    });
    const payload = {
      title: title || foundPost.title,
      description: description || foundPost.description
    }
    const savedPost = await db.posts.update(
      {
        title: payload.title,
        description: payload.description,
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
          attributes: ["userId", "comment", "updatedAt"],
        },
        {
          model: db.likes,
          attributes: ["user_id", "post_id"],
          include: [
            {
              model: db.user,
              attributes: [["id", "userId"], "name"],
            },
          ],
        },
      ],
    });
    res.json({ result: posts });
  }),
  getAllPosts: asyncHandler(async (req, res) => {
    const query = {
      include: [
        {
          model: db.comments,
          attributes: [["id", "commentId"], "userId", "comment", "createdAt"],
        },
        {
          model: db.likes,
          attributes: ["user_id", "post_id"],
          include: [
            {
              model: db.user,
              attributes: [["id", "userId"], "name"],
            },
          ],
        },
      ],
    };
    const allPosts = await redisClient.get(query);
    if (allPosts) {
      console.log('SERVING FROM CACHE !!!!')
      return res.json({ result: JSON.parse(allPosts) });
    }
    const posts = await db.posts.findAll(query);
    await redisClient.set(query, JSON.stringify(posts));
    res.json({ result: posts });
  }),
  deletePost: asyncHandler(async (req, res, next) => {
    const { id: postId } = req.params;
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
  likePost: asyncHandler(async (req, res, next) => {
    const loggedInUser = req.session["user"]["userId"];
    const { id: postId } = req.params;
    const foundRecords = await db.likes.findAll({
      where: {
        post_id: postId,
        user_id: loggedInUser,
      }
    });
    let likeDetails;
    if (!foundRecords.length)
      likeDetails = await db.likes.create({
        post_id: postId,
        user_id: loggedInUser,
      });
    if (!likeDetails) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    res.json({ status: "ok" });
  }),
  unlikePost: asyncHandler(async (req, res, next) => {
    const loggedInUser = req.session["user"]["userId"];
    const { id: postId } = req.params;
    let likeDetails = await db.likes.destroy({
      where: {
        post_id: postId,
        user_id: loggedInUser,
      },
    });

    if (!likeDetails) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    res.json({ status: "ok" });
  }),
};
