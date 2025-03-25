import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '#models/user.js'
import RefreshToken from '#models/refreshToken.js'
import AppError from '#utils/appError.js'

class AuthController {
  constructor() {
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.logout = this.logout.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.createUser = this.createUser.bind(this)

    this.login = asyncHandler(this.login)
    this.refreshToken = asyncHandler(this.refreshToken)
    this.logout = asyncHandler(this.logout)
    this.refreshToken = asyncHandler(this.refreshToken)
    this.createUser = asyncHandler(this.createUser)
  }

  async login(req, res) {
    const { email, password } = req.body
    if (!email || !password) throw new AppError("Email and password are required", 400)

    const user = await User.findOne({ email })
    if (!user) throw new AppError("User is not found", 404)
      
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new AppError("Invalid credentials", 400)
  
    const payload = { id: user._id, username: user.name, email: user.email}
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    // const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
  
    // const newRefreshToken = new RefreshToken({
    //   refreshToken: refreshToken,
    //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   userId: user._id
    // })
  
    // await newRefreshToken.save()
  
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000
    // })
  
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 3600000 
    })
  
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
    })
  }

  async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken
  
    if (!refreshToken) throw new AppError("Refresh token is missing, please login in again", 403)
  
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken = Refresh.findOne({ refreshToken })
  
    if (!storedToken) throw new AppError("Refresh token not found in the database", 403)

    const payload = { id: decoded._id, username: decoded.name, email: decoded.email }
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' })
  
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    })
    
    return res.status(200).json({ message: 'Token refreshed successfully' });
  }

  async logout(req, res) {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  }
  
  async forgotPassword(req, res) {
    try {
  
    } catch (err) {
      
    }
  }

  async createUser(req, res) {
    const { email, password, name } = req.body
  
    if (!email || !password || !name) throw new AppError("Email, Password, Name fields are required", 400)

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new AppError("User already exists", 400)
  
    const newUser = new User({
      email,
      password,
      name,
      isActive: true,
    })
  
    await newUser.save()
    res.status(201).json({ message: "User created successfully", user: newUser })
  }

  async renderLogin(req, res) {
    try {
      res.render('auth/login', {
        title: 'Login'
      })
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default AuthController