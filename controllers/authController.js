import User from '../models/user.js'
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

    const payload = { userName: user.username }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

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

export const logout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
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