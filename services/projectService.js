import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"
import AppError from '../appError.js'
import mongoose from 'mongoose'

class ProjectService {
  async getAll() {
    return Project.find().lean()
  }

  async getById(id) {
    const project = await Project.findById(id)
    
    if (!project) 
      throw new AppError("Project was not found", 404)
    return project
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

  async editProject(reqBody, id, filePath) {
    const { name, description, preview, link, public_id, asset_id, previewChanged } = reqBody

    if (!name || !description || !link) throw new AppError("All fields are required: name, description, link", 400)

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Project ID", 400)

    let updatedFields = { name, description, link };
    const isPreviewChanged = (previewChanged === 'true')

    if (isPreviewChanged) {
     try {
      await cloudinary.uploader.destroy(public_id)
      const uploadingResult =  await cloudinary.uploader.upload(filePath, { folder: 'projects' })

      updatedFields.preview = uploadingResult.secure_url;
      updatedFields.public_id = uploadingResult.public_id;
      updatedFields.asset_id = uploadingResult.asset_id;
     } catch (error) {
      throw new AppError(`Cloudinary Error ${error.message}`, 500)
     }
    } else {
      updatedFields.preview = preview
      updatedFields.asset_id = asset_id
      updatedFields.public_id = public_id
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedProject) 
      throw new AppError("Project was not found", 404)
    return updatedProject
  }

  async deleteProject(publicId, id) {
    if (!publicId) throw new AppError("Project public ID is required", 400)

    const projectToDelete = await Project.findById(id)
    if (!projectToDelete) throw new AppError("Project not found", 404)

    await cloudinary.uploader.destroy(publicId)
    await Project.findByIdAndDelete(id)
  }
}

export default ProjectService