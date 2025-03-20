import { StatusCodes } from "http-status-codes"
import User from "../models/user.js"

class SettingsService {
  async updateUserInfo(req) {
    const { email, name } = req.body
    const userId = req.user.id
  
    const updatedUser = await User.findByIdAndUpdate(userId, { email, name }, {
      new: true, 
      runValidators: true 
    })

    if (!updatedUser) 
      throw new AppError("User not found", StatusCodes.NOT_FOUND)
    return updatedUser
  }

  async deleteUserAccount(req) {
    const userId = req.user.id
    const { email } = req.body

    if (!email || email !== req.user.email) throw new AppError("Email confirmation does not match", StatusCodes.BAD_REQUEST)
  
    const user = await User.findById(userId)
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND)
    
    await User.findByIdAndDelete(userId)
    return user
  }

  async updatePassword(req) {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id
    
    if (!oldPassword || !newPassword) throw new AppError("Old password and new password fields are required", StatusCodes.BAD_REQUEST)
    
    const user = await User.findById(userId)
    if (!user) throw new AppError("User not found", StatusCodes.BAD_REQUEST)
    
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new AppError("Old password is incorrect", StatusCodes.BAD_REQUEST)

    user.password = newPassword
    await user.save()
  }
}

export default SettingsService