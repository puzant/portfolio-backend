import asyncHandler from 'express-async-handler'
import { StatusCodes } from 'http-status-codes'
import AppError from '#utils/appError.js'
import ApiResponse from '#utils/apiResponse.js'

class PublicationController {
  constructor(publicationService) {
    this.publicationService = publicationService
    this.getAllPublications = asyncHandler(this.getAllPublications.bind(this))
    this.addPublication = asyncHandler(this.addPublication.bind(this))
    this.editPublication = asyncHandler(this.editPublication.bind(this))
    this.deletePublication = asyncHandler(this.deletePublication.bind(this))
    this.renderAddPublication = this.renderAddPublication.bind(this)
    this.renderEditPublication = this.renderEditPublication.bind(this)
  }

  async getAllPublications (req, res) {
    const publications = await this.publicationService.getAll()
    return res.status(StatusCodes.OK).json(ApiResponse.successResponse("Publications retrived successfully", publications))
  }

  async addPublication(req, res) {  
    const publication = await this.publicationService.addPublication(req)
    return res.status(StatusCodes.CREATED).json(ApiResponse.successResponse("Publication saved successfully", publication ))
  }

  async editPublication(req, res) {
    const { id } = req.params
    const updatedPublication = await this.publicationService.editPublication(req, id)

    return res.status(StatusCodes.OK).json(ApiResponse.successResponse("Publication updated successfully", updatedPublication))
  }

  async deletePublication(req, res) {
    await this.publicationService.deletePublication(req.params.id)
    return res.status(StatusCodes.OK).json(ApiResponse.successResponse("Publication deleted successfully"))
  }

  // Route to render the Add Publication form
  async renderAddPublication(req, res, next) {
    try {
      return res.render('publications/addPublication', {
        title: 'Add Publication',
        user: req.user
      })
    } catch (err) {
      next(new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  // Route to render the Edit Publication form
  async renderEditPublication (req, res, next) {
    try {
      const publication = await this.publicationService.getById(req.params.id)
    
      if (!publication) 
        return res.status(StatusCodes.NOT_FOUND).send('Publication not found')
     
      const formattedPublication = this.publicationService.formatPublicationData(publication)
      
      return res.render('publications/editPublication', {
        publication: formattedPublication,
        title: 'Edit Publication',
        user: req.user
        }
      )
    } catch (err) {
      next(new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}

export default PublicationController