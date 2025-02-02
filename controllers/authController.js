export const renderLogin = async (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Login'
    })
  } catch (err) {
    res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
  }
}