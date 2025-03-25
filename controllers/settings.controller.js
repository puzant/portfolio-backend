import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { StatusCodes } from 'http-status-codes'
import User from '@models/user.js'
import AppError from '@utils/appError.js'
import ApiResponse from '@utils/apiResponse.js'

class SettingsController {
  constructor(settingsService) {
    this.settingsService = settingsService
    this.updateUserInfo = asyncHandler(this.updateUserInfo.bind(this))
    this.deleteUserAccount = asyncHandler(this.deleteUserAccount.bind(this))
    this.updatePassword = asyncHandler(this.updatePassword.bind(this))
    this.renderSettings = this.renderSettings.bind(this)
  }

  async updateUserInfo(req, res) {
    const updatedUser = await this.settingsService.updateUserInfo(req)
    res.status(StatusCodes.OK).json(ApiResponse.successResponse("User updated successfully", updatedUser))
  }

  async deleteUserAccount(req, res) {
    const user = await this.settingsService.deleteUserAccount(req)
    res.status(StatusCodes.OK).json(ApiResponse.successResponse("User updated successfully", user))
  }

  async updatePassword(req, res) {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id
    
    if (!oldPassword || !newPassword) throw new AppError("Old password and new password fields are required", StatusCodes.BAD_REQUEST)
    
    const user = await User.findById(userId)
    if (!user) throw new AppError("User not found", StatusCodes.BAD_REQUEST)
    
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new AppError("Old password is incorrect", StatusCodes.BAD_REQUEST)

    user.password = newPassword
    await user.save()
    res.status(200).json(ApiResponse.successResponse("Password updated successfully"))
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