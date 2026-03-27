import asyncHandler from 'express-async-handler'

class CMSController {
  constructor(projectService, publicationService, travelImageService) {
    this.projectService = projectService
    this.publicationService = publicationService
    this.travelImageService = travelImageService
  }

  renderCmsPage = asyncHandler(async (req, res) => {
    const { status = 'all', country = 'all' } = req.query

    const [projects, publications, travelImages] = await Promise.all([
      this.projectService.getAll(req.user, { status }),
      this.publicationService.getAll(req.user),
      this.travelImageService.getAll(req.user, { country })
    ])

    res.render('index', {
      projects, 
      publications, 
      travelImages, 
      currentStatus: status, 
      currentCountry: country,
      title: 'CMS'
    })
  })
}

export default CMSController