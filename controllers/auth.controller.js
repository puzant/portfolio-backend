import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'

import ApiResponse from '#utils/apiResponse.js'
import setAuthCookies from '#utils/setAuthCookies.js'

class AuthController {
  constructor(authService) {
    this.authService = authService
    this.guestLogin = asyncHandler(this.guestLogin.bind(this))
    this.login = asyncHandler(this.login.bind(this))
    this.logout = asyncHandler(this.logout.bind(this))
    this.createUser = asyncHandler(this.createUser.bind(this))
  }

  async guestLogin(req, res) {
    const { guestToken, guestRefreshToken, guest } = await this.authService.createGuestUser()
    setAuthCookies(res, guestToken, guestRefreshToken)

    guest.refreshToken = guestRefreshToken
    await guest.save()

    return res.status(Status.OK).json(ApiResponse.successResponse("Login successful", {
      id: guest._id,
      username: guest.username,
    }))
  }

  async login(req, res) {
    const { token, refreshToken, user } = await this.authService.login(req)
    setAuthCookies(res, token, refreshToken)

    user.refreshToken = refreshToken
    await user.save()

    return res.status(Status.OK).json(ApiResponse.successResponse("Login successful", {
      id: user._id,
      username: user.username,
      email: user.email
    }))
  }

  async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.status(Status.OK).json(ApiResponse.successResponse("Logged out successfully"))
  }

  async createUser(req, res) {
    const newUser = await this.authService.createUser(req)
    res.status(Status.CREATED).json(ApiResponse.successResponse("User created successfully", { user: newUser }))
  }

  async renderPasswordReset(req, res) {
    try {
      res.render('auth/forgotPassword', {
        title: 'Reset Password'
      })
    } catch (err) {
      res.status(Status.INTERNAL_SERVER_ERROR).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
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