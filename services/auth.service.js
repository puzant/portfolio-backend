import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { StatusCodes as Status } from "http-status-codes"
import nodeMailer from 'nodemailer'

import User from "#models/user.model.js"
import AppError from "#utils/appError.js"

class AuthService {
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

    return { guestToken, guestRefreshToken, guest }
  }

  async login(req) {
    const { email, password } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) 
      throw new AppError("Email and password are required", Status.BAD_REQUEST, errors.array())

    const user = await User.findOne({ email })
    if (!user) throw new AppError("User is not found", Status.NOT_FOUND)
        
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) throw new AppError("Invalid credentials", Status.BAD_REQUEST)
    
    const payload = { id: user._id, username: user.name, email: user.email, role: user.role }
    const refreshPayload = { id: user._id }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15min' })
    const refreshToken = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    return { token, refreshToken, user }
  }

  async changePassword(req) {
    const userId = req.user.id
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) throw new AppError("User is not found", Status.NOT_FOUND)

    const isMatch = bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new AppError("Old password is incorrect", Status.BAD_REQUEST)

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword

    await user.save()
    await this.sendEmailToUser(user, req)
  }

  async sendEmailToUser(user, req) {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: 'puzant24@gmail.com',
        pass: 'askdsiklfkybohjm'
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Changed",
      text: `
        Your Password was changed
        User: ${user.email}
        User ID: ${user.id}
        IP: ${req.ip}
        Time: ${new Date()}
      `
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