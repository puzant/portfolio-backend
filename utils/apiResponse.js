class ApiResponse {
  static successResponse(message, data = null) {
    return { message, data }
  }
}

export default ApiResponse