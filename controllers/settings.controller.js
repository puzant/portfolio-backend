import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'
import ApiResponse from '#utils/apiResponse.js'
import User from '#models/user.model.js'

class SettingsController {
  constructor(settingsService) {
    this.settingsService = settingsService
  }

  triggerNetlifyDeployment = asyncHandler(async (req, res) => {
    const response = await this.settingsService.handleNetlifyDeployment()
    return res.status(Status.OK).json(ApiResponse.successResponse("Deployment started", response))
  })

  updateUserInfo = asyncHandler(async (req, res) => {
    const updatedUser = await this.settingsService.updateUserInfo(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("User updated successfully", updatedUser))
  })

  deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await this.settingsService.deleteUserAccount(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("User deleted successfully", user))
  })

  updatePassword = asyncHandler(async (req, res) => {
     await this.settingsService.updatePassword(req)
    return res.status(200).json(ApiResponse.successResponse("Password updated successfully"))
  })

  renderSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    try {
      res.render('settings/settings', {
        title: 'Settings',
        user: user
      })
    } catch (error) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  })
}

export default SettingsController