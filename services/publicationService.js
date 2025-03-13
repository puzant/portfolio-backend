import { DateTime } from 'luxon'
import AppError from "../appError.js"
import Publication from '../models/publications.js'
import mongoose from 'mongoose'

class PublicationService {
  async getAll() {
    return Publication.find().sort({ publishedDate: -1 }).lean()
  }

  async getById(id) {
    return Publication.findById(id)
  }

  async addPublication(reqBody) {
    const { title, publishedDate, link, duration, preview } = reqBody
  
    if (!title || !publishedDate || !link || !duration || !preview) 
      throw new AppError("All fields are required: title, publishedDate, link, duration, preview", 400)

    const publication = await Publication.create({ title, publishedDate: new Date(publishedDate), link, duration, preview })
    return publication
  }

  async editPublication(reqBody, id) {
    const { title, publishedDate, link, duration, preview } = reqBody

    if (!title || !publishedDate || !link || !duration || !preview)
      throw new AppError("All fields are required: title, publishedDate, link, duration, preview", 400)

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Publication ID", 400)

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      { title, publishedDate: new Date(publishedDate), link, duration, preview, lastModified: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedPublication) 
      throw new AppError("Publication was not found", 404);
    
    return updatedPublication
  }

  async deletePublication(id) {
    const publicationToDelete = await Publication.findByIdAndDelete(id)
    if (!publicationToDelete) throw new AppError("Publication not found", 404)
    
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