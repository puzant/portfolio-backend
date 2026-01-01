const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.render('errorPage', {
      title: 'Access denied',
    })
  }

  next()
}

export default restrictTo