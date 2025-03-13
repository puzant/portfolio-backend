import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"
import AppError from '../appError.js'

class ProjectService {
  async getAll() {
    return Project.find().lean()
  }

  async fetchProjectImages() {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'projects',
    })
      
    const images = result.resources.map((resource) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      asset_id: resource.asset_id,
    }))
    
    return images
  }

  async addProject(reqBody, filePath) {
    const { name, description, link } = reqBody

    if (!name || !description || !link) throw new AppError("All fields are required: name, description, link", 400)
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'projects'
      })

    const project = await Project.create({
      name: name,
      description: description,
      preview: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
      link: link
    })

    return project
  }

  async editProject() {

  }

  async deleteProject() {
    
  }
}

export default new ProjectService()