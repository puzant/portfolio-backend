class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.timeStamp = new Date()
    this.type = this.getErrorType(statusCode)

    Error.captureStackTrace(this, this.constructor)
  }

  getErrorType(statusCode) {
    const statusTypeMap = {
      400: 'Validation Error',
      401: 'Unauthorized Error',
      403: 'Forbidden Error',
      404: 'Not Found Error',
      500: 'Internal Error'
    }

    return statusTypeMap[statusCode] || 'General Error'
  }
}

export default AppError