class ApiResponse {
  static successResponse(message, data = null) {
    return { message, data, success: true }
  }
}

export default ApiResponse