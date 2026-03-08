import jwt from 'jsonwebtoken'
import User from '#models/user.model.js'
import setAuthCookies from '#utils/setAuthCookies.js'

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token
  const refreshToken = req.cookies.refresh_token

  let userId = null
  let baseUser = null

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      userId = decoded.id
      baseUser = decoded
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        res.clearCookie('token')
        res.clearCookie('refresh_token')
        return res.redirect('/login')
      }
    }
  }

  if (!userId && refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const user = await User.findById(decoded.id)

      if (!user || user.refreshToken !== refreshToken) {
        res.clearCookie('token')
        res.clearCookie('refresh_token')
        res.redirect('/login')
      }

      const newAccessToken = jwt.sign(
        { id: user._id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15min' }
      )

      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      )

      user.refreshToken = newRefreshToken
      await user.save()
      setAuthCookies(res, newAccessToken, newRefreshToken)
      
      userId = user._id.toString()
      baseUser = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    } catch (err) {
      res.clearCookie('token')
      res.clearCookie('refresh_token')
      res.redirect('/login')
    }
  }

  if (userId) {
    console.log(baseUser)
    const extra = await User.findById(userId) 
      .select('country city cacheToggles')
      .lean()

    req.user = {
      ...baseUser,
      country: extra.country,
      city: extra.city,
      cacheToggles: extra.cacheToggles,
    }

    res.locals.user = req.user
  }

  if (!req.user) {
    return res.redirect('/login')
  }

  next()
}

export default authMiddleware