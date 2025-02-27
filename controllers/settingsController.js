import bcrypt from 'bcrypt'
import User from '../models/user.js'

class SettingsController {
  constructor(logger) {
    this.logger = logger
    this.updateUserInfo = this.updateUserInfo.bind(this)
    this.deleteUserAccount = this.deleteUserAccount.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
  }

  async updateUserInfo(req, res) {
    try {
      const { email, name } = req.body
      const userId = req.user.id
  
      const updatedUser = await User.findByIdAndUpdate(userId, { email, name }, {
        new: true, 
        runValidators: true 
      })
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
      }
  
      res.status(200).json({
        success: true, 
        message: "User updated successfully",
        user: updatedUser,
      })
  
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      })
    }
  }

  async deleteUserAccount(req, res) {
    try {
      const userId = req.user.id
      const { email } = req.body
    
      if (!email || email !== req.user.email) {
        return res.status(400).json({ message: "Email confirmation does not match." })
      }
  
      const user = await User.findById(userId)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' })
      }
  
      await User.findByIdAndDelete(userId)
      res.status(200).json({ success: true, message: 'Your account has been deleted successfully.' })
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      })
    }
  }

  async updatePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body
      const userId = req.user.id
    
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' })
      }
    
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
    
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        return res.status(404).json({ success: true, message: 'Old Password is incorrect' })
      }
    
      user.password = newPassword
      await user.save()
    
      res.status(200).json({ message: 'Password updated successfully' })  
    } catch (error) {
      this.logger.logError(error)
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }

  async renderSettings(req, res) {
    try {
      res.render('settings/settings', {
        title: 'Settings',
        user: req.user
      })
    } catch (error) {
      this.logger.logError(error)
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default SettingsController