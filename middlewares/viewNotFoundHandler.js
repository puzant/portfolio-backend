const viewNotFoundHandler = (req, res) => {
  const user = req.user || null
  
  res.status(404).render('404', {
    title: 'Page Not Found',
    message: `The page "${req.originalUrl}" does not exist.`,
    user
  })
}

export default viewNotFoundHandler