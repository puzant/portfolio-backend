import jwt from 'jsonwebtoken'
import User from '#models/user.model.js'
import setAuthCookies from '#utils/setAuthCookies.js'

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token
  const refreshToken = req.cookies.refresh_token

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      res.locals.user = req.user
      return next()
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        res.clearCookie('token')
        res.clearCookie('refresh_token')
        return res.redirect('/login')
      }
    }
  }

  if (!refreshToken) {
    return res.redirect('/login')
  }

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

    req.user = { id: user._id, username: user.username, email: user.email, role: user.role }
    res.locals.user = req.user
    next()
  } catch (err) {
    res.clearCookie('token')
    res.clearCookie('refresh_token')
    res.redirect('/login')
  }
}

export default authMiddleware