import cmsService from "#services/cms.service.js"

const renderCmsPage = async (req, res, next) => {
  try {
    const [projects, publications, travelImages] = await Promise.all([
      cmsService.getProjects(),
      cmsService.getPublications(),
      cmsService.getTravelImages()
    ])

    res.render('index', { 
      travelImages,
      publications, 
      projects, 
      title: 'CMS', 
    })
  } catch (error) {
    next(error)
  }
}

export default renderCmsPage