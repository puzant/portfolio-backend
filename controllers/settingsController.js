import bcrypt from 'bcrypt'
import User from '../models/user.js'
import asyncHandler from 'express-async-handler'
import AppError from '../appError.js'

class SettingsController {
  constructor() {
    this.updateUserInfo = this.updateUserInfo.bind(this)
    this.deleteUserAccount = this.deleteUserAccount.bind(this)
    this.updatePassword = this.updatePassword.bind(this)

    this.updateUserInfo = asyncHandler(this.updateUserInfo)
    this.deleteUserAccount = asyncHandler(this.deleteUserAccount)
    this.updatePassword = asyncHandler(this.updatePassword)
  }

  async updateUserInfo(req, res) {
    const { email, name } = req.body
    const userId = req.user.id
  
    const updatedUser = await User.findByIdAndUpdate(userId, { email, name }, {
      new: true, 
      runValidators: true 
    })
  
    if (!updatedUser) {
      throw new Error("User not found", 404)
    }
  
    res.status(200).json({
      success: true, 
      message: "User updated successfully",
      user: updatedUser,
    })
  }

  async deleteUserAccount(req, res) {
    const userId = req.user.id
    const { email } = req.body
    
    if (!email || email !== req.user.email) {
      throw new AppError("Email confirmation does not match", 400)
    }
  
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }
  
    await User.findByIdAndDelete(userId)
    res.status(200).json({ success: true, message: 'Your account has been deleted successfully.' })
  }

  async updatePassword(req, res) {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id
    
    if (!oldPassword || !newPassword) {
      throw new AppError("Old password and new password fields are required", 400)
    }
    
    const user = await User.findById(userId)
    if (!user) {
      throw new AppError("User not found", 400)
    }
    
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new AppError("Old password is incorrect", 400)
    }

    user.password = newPassword
    await user.save()
    res.status(200).json({ message: 'Password updated successfully' })  
  }

  async renderSettings(req, res) {
    try {
      res.render('settings/settings', {
        title: 'Settings',
        user: req.user
      })
    } catch (error) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default SettingsController