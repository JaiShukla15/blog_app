const { db } = require("../db");
const {Op} = require('sequelize');
const jwt = require("jsonwebtoken");
const util = require("util");
const asyncHandler = require("../middlewares/asyncHandler");
const { createError } = require("../errors/customError");
jwt.sign = util.promisify(jwt.sign);
module.exports = {
  getAllUsers: asyncHandler(async (req, res) => {
    let data = await db.user.findAll({
      attributes: ["id", "email", "name", "dob"],
      include: [
        {
          model: db.posts,
          as: "posts",
        },
      ],
    });
    res.json({ result: data });
  }),
  createUser: asyncHandler(async (req, res) => {
    const { email, name, password, dob } = req.body;
    let data = await db.user.create({
      name,
      email,
      password,
      dob,
    });
    res
      .status(201)
      .json({ message: "User Registered Successfully", result: data });
  }),
  login: asyncHandler(async (req, res,next) => {
    const { email, password } = req.body;
    console.log(req.body)
    const foundUser = await db.user.findOne({
      where: {
        email,
        isActive:true
      }
    });
    if (!foundUser) {
      return res
        .status(404)
        .json({ message: "Account not found with this email" });
    }
    if (foundUser && foundUser.password !== password) {
      return next(createError("Incorrect email or password", 409));
    }
    let token = await jwt.sign(
      { email: foundUser.email, userId: foundUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "3000s" }
    );
    let refreshToken = await jwt.sign(
      { email: foundUser.email, userId: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET
    );
    return res.json({
      userId: foundUser.id,
      email: foundUser.email,
      token: token,
      expiresIn: 5 * 60 * 1000,
      refreshToken,
    });
  }),
  logout: asyncHandler(async (req, res,next) => {
    req.session.destroy();
    res.json({ message: "Logout Successfully" });
  }),
};
