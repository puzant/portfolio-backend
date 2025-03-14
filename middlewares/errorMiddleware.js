const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  const type = err.type || 'general'
  const errorDate = err.timeStamp

  res.status(statusCode).json({
    success: false,
    message,
    type,
    errorDate
  })
}

export default errorMiddleware