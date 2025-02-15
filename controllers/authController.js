import User from '../models/user.js'
import RefreshToken from '../models/refreshToken.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
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
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

export const refreshToken = (req, res) => {
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
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export const logout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
}

export const forgotPassword = async (req, res) => {
  try {

  } catch (err) {
    
  }
}

export const createUser = async (req, res) => {
  const { email, password, name } = req.body

  try {
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

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
}

export const renderLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Login'
    })
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}