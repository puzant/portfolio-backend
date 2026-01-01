const setAuthCookies = (res, token, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }

  res.cookie('token', token, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000  // 15 minutes
  })

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  })
}

export default setAuthCookies