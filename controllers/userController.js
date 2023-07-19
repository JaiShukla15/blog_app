const { db } = require("../db");
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const util = require("util");
const asyncHandler = require("../middlewares/asyncHandler");
const { createError } = require("../errors/customError");
jwt.sign = util.promisify(jwt.sign);
bcryptjs.genSalt = util.promisify(bcryptjs.genSalt);
module.exports = {
  getAllUsers: asyncHandler(async (req, res) => {
    let data = await db.user.findAll({
      attributes: ["id", "email", "name", "dob"],
      include: [
        {
          model: db.chats,
          as: "chats",
        },
      ],
      where:{
        id:{
          [Op.ne]:req.session['user'].userId
        }
      }
    });
    res.json({ result: data });
  }),
  createUser: asyncHandler(async (req, res) => {
    const { email, name, password, dob } = req.body;
    const userExists = await db.user.findOne({
      where: {
        email: email
      }
    });
    if (userExists) return res.status(409).json({ message: 'User already exists with same email' });
    const salt = await bcryptjs.genSalt(16);
    if (salt) {
      bcryptjs.hash(password, salt, async (err, hash) => {
        let data = await db.user.create({
          name,
          email,
          password: hash,
          dob,
        });
        console.log(data)
        const response = {
          email: data.email,
          name: data.name
        };
        res
          .status(201)
          .json({ message: "User Registered Successfully", result: response });
      });
    }
  }),
  bulkUpload: asyncHandler(async (req, res) => {
    const { email, name, password, dob } = req.body;
    console.log(req.file, 'FILES')
    console.log(req.files, 'FILES');

  }),
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log('BODY ########', req.body)
    const foundUser = await db.user.findOne({
      where: {
        email,
        isActive: true
      }
    });
    if (!foundUser) {
      return res
        .json({ message: "Account not found with this email" });
    }
    bcryptjs.compare(password, foundUser.password, async (err, success) => {
      if (err) throw err;

      if (!success) {
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
        name: foundUser.name
      });

    })
  }),

  getRefreshToken: asyncHandler(async (req, res, next) => {
    const headers = req.headers;
    if (!headers["x-refresh"])
      return next(
        createError("Refresh token is missing please provide the same", 400)
      );
    let token = headers["x-refresh"].split(" ")[1];
    jwt.verify(token, 'refreshtokensecret', async (err, info) => {
      if (err) {
        return next(
          createError("Refresh token is expired please login", 401)
        );
      }
      let refreshToken = await jwt.sign(
        { email: 'test1@yopmail.com' },
        process.env.REFRESH_TOKEN_SECRET
      );
      let token = await jwt.sign(
        { email: 'test1@yopmail.com' },
        process.env.JWT_SECRET,
        { expiresIn: "10000s" }
      );
      return res.json({
        token,
        expiresIn: 10000,
        refreshToken,
      })
    })
  }),
  logout: asyncHandler(async (req, res, next) => {
    req.session.destroy();
    res.json({ message: "Logout Successfully" });
  }),
};
