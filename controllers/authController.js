import User from '../models/user.js'
import RefreshToken from '../models/refreshToken.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthController {
  constructor(logger) {
    this.logger = logger
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.logout = this.logout.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.createUser = this.createUser.bind(this)
  }

  async login(req, res) {
    const { email, password } = req.body

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
      }
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }
      
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }
  
      const payload = { 
        id: user._id,
        username: user.name,
        email: user.email
       }
  
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
    } catch (error) {
      this.logger.logError(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken
  
      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is missing, please log in again' })
      }
  
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const storedToken = Refresh.findOne({ refreshToken })
  
      if (!storedToken) {
        return res.status(403).json({ message: 'Refresh token not found in the database' })
      }
  
      const payload = { 
        id: decoded._id,
        username: decoded.name,
        email: decoded.email
       }
  
       const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' })
  
       res.cookie('token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      })
  
      return res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
      this.logger.logError(error)
      return res.status(500).json({ message: 'Server error' });
    }
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
  
    try {
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email and password, and Name fields are required" });
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }
  
      const newUser = new User({
        email,
        password,
        name,
        isActive: true,
      })
  
      await newUser.save()
      res.status(201).json({ message: "User created successfully", user: newUser })
  
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({ message: "Server error", error: err });
    }
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