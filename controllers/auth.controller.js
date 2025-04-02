import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'

import ApiResponse from '#utils/apiResponse.js'

class AuthController {
  constructor(authService) {
    this.authService = authService
    this.login = asyncHandler(this.login.bind(this))
    this.logout = asyncHandler(this.logout.bind(this))
    this.forgotPassword = asyncHandler(this.forgotPassword.bind(this))
    this.createUser = asyncHandler(this.createUser.bind(this))
  }

  async login(req, res) {
    const { token, user } = await this.authService.login(req)

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 3600000 
    })
  
    return res.status(Status.OK).json(ApiResponse.successResponse("Login successful", user))
  }

  async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.status(Status.OK).json(ApiResponse.successResponse("Logged out successfully"))
  }
  
  async forgotPassword(req, res) {
    try {
  
    } catch (err) {
      
    }
  }

  async createUser(req, res) {
    const newUser = await this.authService.createUser(req)
    res.status(Status.CREATED).json(ApiResponse.successResponse("User created successfully", { user: newUser }))
  }

  async renderLogin(req, res) {
    try {
      res.render('auth/login', {
        title: 'Login'
      })
    } catch (err) {
      res.status(Status.INTERNAL_SERVER_ERROR).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default AuthController