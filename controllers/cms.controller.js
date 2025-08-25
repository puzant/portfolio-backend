import cmsService from "#services/cms.service.js"

const renderCmsPage = async (req, res, next) => {
  try {
    const projects = await cmsService.getProjects()
    const publications = await cmsService.getPublications()
    const travelImages = await cmsService.getTravelImages()

    const projectsOrder = projects
                          .sort((a, b) => a.priority - b.priority)
                          .map(project => project._id.toString())

    res.render('index', { 
      travelImages,
      publications, 
      projects, 
      title: 'CMS', 
      user: req.user, 
      projectsOrder 
    })
  } catch (error) {
    next(error)
  }
}

export default renderCmsPage