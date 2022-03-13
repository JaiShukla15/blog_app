const { CustomError } = require("../errors/customError");
const ErrorHandler = function (err,req, res, next) {
  if (err instanceof CustomError) {
   return res.status(err.statusCode).json({ messsage: err.message });
  }
  res.status(500).json({message:err.message});
};
module.exports = ErrorHandler;
