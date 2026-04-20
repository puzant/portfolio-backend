import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'
import ApiResponse from '#utils/apiResponse.js'

class SettingsController {
  constructor(settingsService) {
    this.settingsService = settingsService
  }

  triggerNetlifyDeployment = asyncHandler(async (req, res) => {
    const response = await this.settingsService.handleNetlifyDeployment()
    return res.status(Status.OK).json(ApiResponse.successResponse("Deployment started", response))
  })

  changeTheme = asyncHandler(async (req, res) => {
    await this.settingsService.changeTheme(req.user.id, req.body.theme)
    return res.status(Status.OK).json(ApiResponse.successResponse("Theme was updated"))
  })

  toggleCache = asyncHandler(async (req, res) => {
    await this.settingsService.toggleCache(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("Cache settings updated"))
  })

  toggleReOrder = asyncHandler(async (req, res) => {
    const { type, enabled } = req.body
    await this.settingsService.toggleReOrder(req.user.id, type, enabled)
    return res.status(Status.OK).json(ApiResponse.successResponse("Ordering settings updated"))
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
    res.render('settings/settings', {
      title: 'Settings',
    })
  })
}

export default SettingsController