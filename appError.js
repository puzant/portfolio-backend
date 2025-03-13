import { StatusCodes } from 'http-status-codes'

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
      [StatusCodes.BAD_REQUEST]: 'Validation Error',
      [StatusCodes.UNAUTHORIZED]: 'Unauthorized Error',
      [StatusCodes.FORBIDDEN]: 'Forbidden Error',
      [StatusCodes.NOT_FOUND]: 'Not Found Error',
      [StatusCodes.INTERNAL_SERVER_ERROR]: 'Internal Error'
    }

    return statusTypeMap[statusCode] || 'General Error'
  }
}

export default AppError