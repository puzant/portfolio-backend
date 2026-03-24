import asyncHandler from 'express-async-handler'

class CMSController {
  constructor(projectService, publicationService, travelImageService) {
    this.projectService = projectService
    this.publicationService = publicationService
    this.travelImageService = travelImageService
  }

  renderCmsPage = asyncHandler(async (req, res) => {
    const { filter = 'all' } = req.query // all, active, inactive

    const [projects, publications, travelImages] = await Promise.all([
      this.projectService.getAll(req.user, filter),
      this.publicationService.getAll(req.user),
      this.travelImageService.getAll(req.user)
    ])

    res.render('index', {
      projects, publications, travelImages, currentFilter: filter,
      title: 'CMS'
    })
  })
}

export default CMSController