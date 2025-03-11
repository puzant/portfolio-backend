import { DateTime } from 'luxon'
import asyncHandler from 'express-async-handler'
import Publication from '../models/publications.js'
import AppError from '../appError.js'

class PublicationController {
  constructor() {
    this.getAllPublications = this.getAllPublications.bind(this)
    this.addPublication = this.addPublication.bind(this)
    this.editPublication = this.editPublication.bind(this)
    this.deletePublication = this.deletePublication.bind(this)

    this.getAllPublications = asyncHandler(this.getAllPublications)
    this.addPublication = asyncHandler(this.addPublication)
    this.editPublication = asyncHandler(this.editPublication)
    this.deletePublication = asyncHandler(this.deletePublication)
  }

  async getAllPublications (req, res) {
    const publications = await Publication.find().sort({ publishedDate: -1 }).lean()
    
    res.status(200).json({
      success: true, 
      message: "Publications retrieved successfully",
      count: publications.length,
      publications: publications,
    })
  }

  async addPublication(req, res) {  
    const { title, publishedDate, link, duration, preview } = req.body
  
    if (!title || !publishedDate || !link || !duration || !preview) {
      throw new AppError("All fields are required: title, publishedDate, link, duration, preview", 400)
    }

    const publication = await Publication.create({ title, publishedDate: new Date(publishedDate), link, duration, preview })
    res.status(201).json({
      success: true,
      message: "Publication saved successfully",
      publication
    })
  }

  async editPublication(req, res) {
    const { id } = req.params
    const { title, publishedDate, link, duration, preview } = req.body
  
    if (!title || !publishedDate || !link || !duration || !preview) {
      throw new AppError("All fields are required: title, publishedDate, link, duration, preview", 400)
    }

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, publishedDate: new Date(publishedDate), link, duration, preview, lastModified: new Date() },
      { new: true, runValidators: true }
    )
  
    if (!updatedPublication) {
      throw new AppError("Publication was not found", 404)
    }
  
    return res.status(200).json({
      success: true,
      message: "Publication updated successfully",
      updatedPublication
    })
  }

  async deletePublication(req, res) {
    const publicationToDelete = await Publication.findByIdAndDelete(req.params.id)
  
    if (!publicationToDelete) {
      throw new AppError("Publication not found", 404)
    }
  
    res.status(200).json({
      success: true,
      message: 'Publication deleted successfully', 
      publicationToDelete
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
      const publication = await Publication.findById(req.params.id)
    
      if (!publication) 
        return res.status(404).send('Publication not found')
     
      res.render('publications/editPublication', {
         publication: {
          _id: publication._id,
          title: publication.title, 
          publishedDate: DateTime.fromJSDate(publication.publishedDate).toFormat('yyyy-MM-dd'),
          lastModified: DateTime.fromJSDate(publication.lastModified).toFormat('yyyy-MM-dd HH:mm:ss'),
          link: publication.link, 
          duration: publication.duration, 
          preview: publication.preview, 
        },
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