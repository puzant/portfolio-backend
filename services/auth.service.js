import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { StatusCodes as Status } from "http-status-codes"

import User from "#models/user.model.js"
import EmailQueue from '../queues/email.queue.js'
import TokenService from './token.service.js'
import AppError from "#utils/appError.js"

class AuthService {
  constructor() {
    this.emailQueue = EmailQueue
    this.tokenService = TokenService
  }

  async forgotPassword(req) {
    const { email, ipAddress } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) return

    const { rawToken, hashedToken } = this.tokenService.generateResetToken()
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    
    await user.save()
    await this.emailQueue.addPasswordResetJob({
      email: user.email,
      name: user.name,
      resetToken: rawToken,
      ipAddress: ipAddress,
      timestamp: new Date().toISOString()
    })
  }

  async setNewPassword(req) {
    const { token, newPassword } = req.body

    if (!token || !newPassword) 
      throw new AppError('Token and new password are required', Status.BAD_REQUEST)

    const hashedToken = this.tokenService.hashToken(token)

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) 
      throw new AppError('Invalid or expired token', Status.BAD_REQUEST)

    user.password = newPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    user.passwordChangedAt = new Date()
    
    await user.save()
    await this.emailQueue.addPasswordChangedJob({
      email: user.email,
      name: user.name,
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })
  }

  async createGuestUser() {
    let guest = await User.findOne({ role: 'guest' })

    if(!guest) {
      guest = await User.create({
        role: 'guest',
        name: 'Guest',
        email: 'guest@app.com'
      })
    }

    const guestPayload = { id: guest._id, username: guest.name, email: guest.email, role: guest.role }
    const refreshPayload = { id: guest._id }

    const guestToken = jwt.sign(guestPayload, process.env.JWT_SECRET, { expiresIn: '15min' })
    const guestRefreshToken = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    guest.refreshToken = guestRefreshToken
    await guest.save()
    return { guestToken, guestRefreshToken, guest }
  }

  async login(req) {
    const { email, password } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) 
      throw new AppError("Email and password are required", Status.BAD_REQUEST, errors.array())

    const user = await User.findOne({ email })
    if (!user) throw new AppError("User is not found", Status.NOT_FOUND)
        
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new AppError("Invalid credentials", Status.BAD_REQUEST)
    
    const payload = { id: user._id, username: user.name, email: user.email, role: user.role }
    const refreshPayload = { id: user._id }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15min' })
    const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    user.refreshToken = refreshToken
    await user.save()
    return { token, refreshToken, user }
  }

  async changePassword(req) {
    const userId = req.user.id
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) throw new AppError("User is not found", Status.NOT_FOUND)

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new AppError("Old password is incorrect", Status.BAD_REQUEST)
    user.password = newPassword

    await user.save()
    await this.emailQueue.addPasswordChangedJob({
      email: user.email,
      name: user.name,
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })
  }

  async createUser(req) {
    const { email, password, name } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) 
      throw new AppError("Email, Password, Name fields are required", Status.BAD_REQUEST, errors.array())

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new AppError("User already exists", Status.BAD_REQUEST)
    
    const newUser = new User({
      email,
      password,
      name,
      isActive: true,
    })
    
    await newUser.save()
    return newUser
  }
}

export default AuthService