import { DateTime } from 'luxon'
import Projects from '#models/project.js'
import Publications from '#models/publications.js'
import cloudinaryService from '../cloudinary.js'

class CmsService {
  async getProjects() {
    return Projects.find().sort({ priority: 1 }).lean()
  }

  async getPublications() {
    const pubications = await Publications.find({}).sort({ publishedDate: -1 }).lean()
    return pubications.map(p => {
        return {
          ...p, 
          publishedDate: DateTime.fromJSDate(p.publishedDate).toFormat('yyyy-MM-dd')
        }
      }
    )
  }

  async getTravelImages() {
    return cloudinaryService.fetchTravelImages()
  }
}

export default new CmsService()