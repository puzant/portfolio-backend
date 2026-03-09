import asyncHandler from 'express-async-handler'

class CMSController {
  constructor(projectService, publicationService, travelImageService) {
    this.projectService = projectService
    this.publicationService = publicationService
    this.travelImageService = travelImageService
  }

  renderCmsPage = asyncHandler(async (req, res) => {
    const [projects, publications, travelImages] = await Promise.all([
      this.projectService.getAll(req.user),
      this.publicationService.getAll(req.user),
      this.travelImageService.getAll(req.user)
    ])

    res.render('index', {
      projects, publications, travelImages,
      title: 'CMS'
    })
  })
}

export default CMSController