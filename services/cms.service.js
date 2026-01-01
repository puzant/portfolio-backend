import { DateTime } from 'luxon'
import Projects from '#models/project.model.js'
import Publications from '#models/publication.model.js'
import TravelImages from '#models/travelImage.model.js'

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
    return TravelImages.find().sort({ order: 1 }).lean()
  }
}

export default new CmsService()