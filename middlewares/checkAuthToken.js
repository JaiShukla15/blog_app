const jwt = require("jsonwebtoken");
const { createError } = require("../errors/customError");
const SECRET_KEY = process.env.JWT_SECRET;
const checkAuthToken = async (req, res, next) => {
  const headers = req.headers;
  if (!headers["authorization"])
    return next(
      createError("Auth token is missing please provide the same", 401)
    );
  let token = headers["authorization"].split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, info) => {
    if (err) {
      return next(
        createError("Token is expired please login in", 401)
      );
    }
    req.session["user"] = {
      userId: info.userId,
      email: info.email,
    };
    next();
  });
};
module.exports = checkAuthToken;
