import bcrypt from 'bcrypt'
import User from '../models/user.js'

export const updateUserInfo = async (req, res) => {
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

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    })
  }
}

export const updatePassword = async (req, res) => {
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
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}

export const renderSettings = async (req, res) => {
  try {
    res.render('settings/settings', {
      title: 'Settings',
      user: req.user
    })
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}