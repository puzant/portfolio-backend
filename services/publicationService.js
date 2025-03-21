import mongoose from 'mongoose'
import { DateTime } from 'luxon'
import { StatusCodes } from 'http-status-codes'
import { validationResult } from 'express-validator'

import AppError from "../utils/appError.js"
import Publication from '../models/publications.js'

class PublicationService {
  async getAll() {
    return Publication.find().sort({ publishedDate: -1 }).lean()
  }

  async getById(id) {
    return Publication.findById(id)
  }

  async addPublication(req) {
    const { title, publishedDate, link, duration, preview } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) 
      throw new AppError("Validation error", StatusCodes.BAD_REQUEST, errors.array())

    const publication = await Publication.create({ title, publishedDate: new Date(publishedDate), link, duration, preview })
    return publication
  }

  async editPublication(req, id) {
    const { title, publishedDate, link, duration, preview } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) 
      throw new AppError("Validation error", StatusCodes.BAD_REQUEST, errors.array())

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Publication ID", StatusCodes.BAD_REQUEST)

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, publishedDate: new Date(publishedDate), link, duration, preview, lastModified: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedPublication) 
      throw new AppError("Publication was not found", StatusCodes.NOT_FOUND);
    
    return updatedPublication
  }

  async deletePublication(id) {
    const publicationToDelete = await Publication.findByIdAndDelete(id)
    if (!publicationToDelete) throw new AppError("Publication not found", StatusCodes.BAD_REQUEST)
    
    return publicationToDelete
  }

  formatPublicationData(publication) {
    return {
      _id: publication._id,
      title: publication.title, 
      publishedDate: DateTime.fromJSDate(publication.publishedDate).toFormat('yyyy-MM-dd'),
      lastModified: DateTime.fromJSDate(publication.lastModified).toFormat('yyyy-MM-dd HH:mm:ss'),
      link: publication.link, 
      duration: publication.duration, 
      preview: publication.preview, 
    } 
  }
}

export default PublicationService