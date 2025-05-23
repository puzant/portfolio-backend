import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'
import ApiResponse from '#utils/apiResponse.js'
import User from '#models/user.js'

class SettingsController {
  constructor(settingsService) {
    this.settingsService = settingsService
    this.triggerNetlifyDeployment = asyncHandler(this.triggerNetlifyDeployment.bind(this))
    this.updateUserInfo = asyncHandler(this.updateUserInfo.bind(this))
    this.deleteUserAccount = asyncHandler(this.deleteUserAccount.bind(this))
    this.updatePassword = asyncHandler(this.updatePassword.bind(this))
    this.renderSettings = this.renderSettings.bind(this)
  }

  async triggerNetlifyDeployment(req, res) {
    const response = await this.settingsService.handleNetlifyDeployment()
    return res.status(Status.OK).json(ApiResponse.successResponse("Deployment started", response))
  }

  async updateUserInfo(req, res) {
    const updatedUser = await this.settingsService.updateUserInfo(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("User updated successfully", updatedUser))
  }

  async deleteUserAccount(req, res) {
    const user = await this.settingsService.deleteUserAccount(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("User deleted successfully", user))
  }

  async updatePassword(req, res) {
     await this.settingsService.updatePassword(req)
    return res.status(200).json(ApiResponse.successResponse("Password updated successfully"))
  }

  async renderSettings(req, res) {
    const user = await User.findById(req.user.id)

    try {
      res.render('settings/settings', {
        title: 'Settings',
        user: user
      })
    } catch (error) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default SettingsController