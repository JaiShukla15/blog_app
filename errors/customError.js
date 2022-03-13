class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
}
const createError = function (message, status) {
  return new CustomError(message, status);
};
module.exports = {
  CustomError,
  createError
};
