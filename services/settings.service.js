import bcrypt from 'bcrypt'
import { StatusCodes as Status } from "http-status-codes"
import User from "#models/user.js"
import AppError from "#utils/appError.js"

class SettingsService {
  async updateUserInfo(req) {
    const { email, name } = req.body
    const userId = req.user.id
  
    const updatedUser = await User.findByIdAndUpdate(userId, { email, name }, {
      new: true, 
      runValidators: true 
    })

    if (!updatedUser) 
      throw new AppError("User not found", Status.NOT_FOUND)
    return updatedUser
  }

  async deleteUserAccount(req) {
    const userId = req.user.id
    const { email } = req.body

    if (!email || email !== req.user.email) throw new AppError("Email confirmation does not match", Status.BAD_REQUEST)
  
    const user = await User.findById(userId)
    if (!user) throw new AppError("User not found", Status.NOT_FOUND)
    
    await User.findByIdAndDelete(userId)
    return user
  }

  async updatePassword(req) {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id
    
    if (!oldPassword || !newPassword) throw new AppError("Old password and new password fields are required", Status.BAD_REQUEST)
    
    const user = await User.findById(userId)
    if (!user) throw new AppError("User not found", Status.BAD_REQUEST)
    
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new AppError("Old password is incorrect", Status.BAD_REQUEST)

    user.password = newPassword
    await user.save()
    return user
  }
}

export default SettingsService