class ApiResponse {
  static successResponse(message, data = null) {
    return { 
      message, 
      data, 
      length: Array.isArray(data) ? data.length : null,
      success: true, 
    }
  }
}

export default ApiResponse