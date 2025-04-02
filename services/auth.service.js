import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import User from "#models/user.js"
import AppError from "#utils/appError.js"
import { StatusCodes as Status } from "http-status-codes"

class AuthService {
  async login(req) {
    const { email, password } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) 
      throw new AppError("Email and password are required", Status.BAD_REQUEST, errors.array())

    const user = await User.findOne({ email })
    if (!user) throw new AppError("User is not found", Status.NOT_FOUND)
        
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new AppError("Invalid credentials", Status.BAD_REQUEST)
    
    const payload = { id: user._id, username: user.name, email: user.email}
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    return { token, user }
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