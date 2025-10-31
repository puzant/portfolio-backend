import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes as Status } from 'http-status-codes'
import Project from "#models/project.model.js"
import AppError from '#utils/appError.js'
import { validationResult } from 'express-validator'

class ProjectService {
  async getAll() {
    return Project.find().sort({ priority: 1 }).lean()
  }

  async getById(id) {
    const project = await Project.findById(id)
    
    if (!project) 
      throw new AppError("Project was not found", Status.NOT_FOUND)
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

  async addProject(req) {
    const { name, description, link, repo, active } = req.body
    const errors = validationResult(req)
    let activeValue

    if (!errors.isEmpty()) 
      throw new AppError("Validation error", Status.BAD_REQUEST, errors.array())
  
    if (Array.isArray(req.body.active)) {
      activeValue = active.includes('true')
    } else {
      activeValue = active === 'true'
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'projects'
    })

    const project = await Project.create({
      name: name,
      description: description,
      preview: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
      link: link,
      active: activeValue,
      repo: repo
    })

    return project
  }

  async editProject(req, id) {
    const { name, description, preview, link, public_id, asset_id, previewChanged, active, repo } = req.body
    const errors = validationResult(req)
    let activeValue

    if (!errors.isEmpty()) 
      throw new AppError("Validation error", Status.BAD_REQUEST, errors.array())

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Project ID", Status.NOT_FOUND)

    if (Array.isArray(req.body.active)) {
      activeValue = active.includes('true')
    } else {
      activeValue = active === 'true'
    }

    let updatedFields = { name, description, link, activeValue, repo }
    const isPreviewChanged = (previewChanged === 'true')

    if (isPreviewChanged) {
      try {
        await cloudinary.uploader.destroy(public_id)
        const uploadingResult =  await cloudinary.uploader.upload(req.file.path, { folder: 'projects' })

        updatedFields.preview = uploadingResult.secure_url;
        updatedFields.public_id = uploadingResult.public_id;
        updatedFields.asset_id = uploadingResult.asset_id;
      } catch (error) {
        throw new AppError(`Cloudinary Error ${error.message}`, Status.INTERNAL_SERVER_ERROR)
      }
    } else {
      updatedFields.preview = preview
      updatedFields.asset_id = asset_id
      updatedFields.public_id = public_id
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedProject) 
      throw new AppError("Project was not found", Status.NOT_FOUND)
    return updatedProject
  }

  async deleteProject(publicId, id) {
    if (!publicId) throw new AppError("Project public ID is required", Status.BAD_REQUEST)

    const projectToDelete = await Project.findById(id)
    if (!projectToDelete) throw new AppError("Project not found", Status.NOT_FOUND)

    await cloudinary.uploader.destroy(publicId)
    await Project.findByIdAndDelete(id)
  }

  async reorderProject(order) {
    const bulkOps = order.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { priority: index } }
    }))

    const res = await Project.bulkWrite(bulkOps)
    return res
  }

}

export default ProjectService