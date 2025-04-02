import AppError from "#utils/appError.js"

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Requested path ${req.originalUrl} not found`, 404));
}

export default notFoundHandler