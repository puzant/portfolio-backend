import AppError from "#utils/appError.js"

const apiNotFoundHandler = (req, res, next) => {
  if (req.path.startsWith('/v1')) {
    return next(new AppError(`Requested path ${req.originalUrl} not found`, 404));
  }

  next()
}

export default apiNotFoundHandler