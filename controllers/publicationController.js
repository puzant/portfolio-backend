import asyncHandler from 'express-async-handler'
import PublicationService from '../services/publicationService.js'

class PublicationController {
  constructor() {
    this.publicationService = new PublicationService()

    this.getAllPublications = asyncHandler(this.getAllPublications.bind(this))
    this.addPublication = asyncHandler(this.addPublication.bind(this))
    this.editPublication = asyncHandler(this.editPublication.bind(this))
    this.deletePublication = asyncHandler(this.deletePublication.bind(this))
  }

  async getAllPublications (req, res) {
    const publications = await this.publicationService.getAll()
    
    res.status(200).json({
      success: true, 
      message: "Publications retrieved successfully",
      count: publications.length,
      publications: publications,
    })
  }

  async addPublication(req, res) {  
    const publication = await this.publicationService.addPublication(req.body)

    res.status(201).json({
      success: true,
      message: "Publication saved successfully",
      publication
    })
  }

  async editPublication(req, res) {
    const { id } = req.params
    const updatedPublication = await this.publicationService.editPublication(req.body, id)

    return res.status(200).json({
      success: true,
      message: "Publication updated successfully",
      updatedPublication
    })
  }

  async deletePublication(req, res) {
    await this.publicationService.deletePublication(req.params.id)
    
    res.status(200).json({
      success: true,
      message: 'Publication deleted successfully', 
    })
  }

  // Route to render the Add Publication form
  async renderAddPublication(req, res) {
    try {
      res.render('publications/addPublication', {
        title: 'Add Publication',
        user: req.user
      })
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }

  // Route to render the Edit Publication form
  async renderEditPublication (req, res) {
    try {
      const publication = await this.publicationService.getById(req.params.id)
    
      if (!publication) return res.status(404).send('Publication not found')
     
      const formattedPublication = this.publicationService.formatPublicationData(publication)
      
      res.render('publications/editPublication', {
        publication: formattedPublication,
        title: 'Edit Publication',
        user: req.user
        }
      )
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default PublicationController