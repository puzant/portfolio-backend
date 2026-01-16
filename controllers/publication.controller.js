import { StatusCodes as Status } from 'http-status-codes'
import asyncHandler from 'express-async-handler'
import ApiResponse from '#utils/apiResponse.js'

class PublicationController {
  constructor(publicationService) {
    this.publicationService = publicationService
  }

  getAllPublications = asyncHandler(async (req, res) => {
    const publications = await this.publicationService.getAll()
    return res.status(Status.OK).json(ApiResponse.successResponse("Publications retrived successfully", publications))
  })

  addPublication = asyncHandler(async (req, res) => {  
    const publication = await this.publicationService.addPublication(req)
    return res.status(Status.CREATED).json(ApiResponse.successResponse("Publication saved successfully", publication ))
  })

  editPublication = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updatedPublication = await this.publicationService.editPublication(req, id)

    return res.status(Status.OK).json(ApiResponse.successResponse("Publication updated successfully", updatedPublication))
  })

  deletePublication = asyncHandler(async (req, res) => {
    await this.publicationService.deletePublication(req.params.id)
    return res.status(Status.OK).json(ApiResponse.successResponse("Publication deleted successfully"))
  })

  // Route to render the Add Publication form
  renderAddPublication = asyncHandler(async (req, res) => {
    return res.render('publications/addPublication', {
      title: 'Add Publication',
    })
  })

  // Route to render the Edit Publication form
  renderEditPublication = asyncHandler(async (req, res) => {
    const publication = await this.publicationService.getById(req.params.id)
    const formattedPublication = this.publicationService.formatPublicationData(publication)
      
    return res.render('publications/editPublication', {
      publication: formattedPublication,
      title: 'Edit Publication',
    })
  })
}

export default PublicationController