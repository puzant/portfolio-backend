import cmsService from "#services/cmsService.js"

const renderCmsPage = async (req, res, next) => {
  try {
    const projects = await cmsService.getProjects()
    const publications = await cmsService.getPublications()
    const travelImages = await cmsService.getTravelImages()

    res.render('index', { travelImages, publications, projects, title: 'CMS', user: req.user })
  } catch (error) {
    next(error)
  }
}

export default renderCmsPage