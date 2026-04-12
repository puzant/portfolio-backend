import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { StatusCodes as Status } from 'http-status-codes'
import { validationResult } from 'express-validator'

import Project from "#models/project.model.js"
import AppError from '#utils/appError.js'
import { isProduction } from '#utils/environment.js'

class ProjectService {
  constructor(cache) {
    this.cache = cache
    this.cacheKey = 'projects'
  }

  async getAll(user = null, filters = {}) {
    const useCache = user?.cacheToggles.projects
    const { status } = filters
    let query = {}

    if (status == 'active') query.active = true
    if (status == 'inactive') query.active = false

    if (!useCache || status !== 'all') 
      return Project.find(query).sort({ priority: 1 }).lean()

    let projects = this.cache.get(this.cacheKey)

    if (!projects) {
      projects = await Project.find().sort({ priority: 1 }).lean()
      this.cache.set(this.cacheKey, projects, 43200)
    }

    return projects
  }

  async getById(id) {
    const projects = await this.getAll()
    const project = projects.find(p => p._id.toString() === id.toString())

    if (!project) {
      throw new AppError('Project not found', StatusCodes.NOT_FOUND)
    }

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

    this.cache.del(this.cacheKey)
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

    let updatedFields = { name, description, link, active: activeValue, repo }
    const isPreviewChanged = (previewChanged === 'true')

    if (isPreviewChanged) {
      try {
        if (isProduction()) {
          await cloudinary.uploader.destroy(public_id)
          const uploadingResult =  await cloudinary.uploader.upload(req.file.path, { folder: 'projects' })

          updatedFields.preview = uploadingResult.secure_url
          updatedFields.public_id = uploadingResult.public_id
          updatedFields.asset_id = uploadingResult.asset_id
        } else {
          console.log('⚠️ Skipping Cloudinary upload in development mode')
          updatedFields.preview = preview || 'https://via.placeholder.com/300x200?text=Dev+Image'
          updatedFields.public_id = null
          updatedFields.asset_id = null
        }
      } catch (error) {
        throw new AppError(`Cloudinary Error ${error.message}`, Status.INTERNAL_SERVER_ERROR, error)
      }
    } else {
      updatedFields.preview = preview
      updatedFields.asset_id = asset_id
      updatedFields.public_id = public_id
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });
    if (!updatedProject) 
      throw new AppError("Project was not found", Status.NOT_FOUND)

    this.cache.del(this.cacheKey)
    return updatedProject
  }

  async deleteProject(publicId, id) {
    if (!publicId) throw new AppError("Project public ID is required", Status.BAD_REQUEST)

    const projectToDelete = await Project.findById(id)
    if (!projectToDelete) throw new AppError("Project not found", Status.NOT_FOUND)

    if (isProduction)
      await cloudinary.uploader.destroy(publicId)
    
    await projectToDelete.deleteOne()
    this.cache.del(this.cacheKey)
  }

  async bulkDeleteProjects(projectIds) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      await Project.deleteMany({ _id: { $in: projectIds }}).session(session)

      this.cache.del(this.cacheKey)
      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      throw new AppError("There was error deleting projects", Status.INTERNAL_SERVER_ERROR, err)
    } finally {
      session.endSession()
    }
  }

  async reorderProject(order) {
    const bulkOps = order.map((id, index) => ({
      updateOne: { 
        filter: { _id: id }, 
        update: { $set: { priority: index } } 
      }
    }))

    const res = await Project.bulkWrite(bulkOps)
    this.cache.del(this.cacheKey)
    return res
  }
}

export default ProjectService