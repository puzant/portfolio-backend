import asyncHandler from 'express-async-handler'
import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"
import AppError from '../appError.js'

class ProjectController {
  constructor() {
    this.getAllProjects = this.getAllProjects.bind(this)
    this.getAllProjectsImages = this.getAllProjectsImages.bind(this)
    this.addProject = this.addProject.bind(this)
    this.editProject = this.editProject.bind(this)
    this.deleteProject = this.deleteProject.bind(this)

    this.getAllProjects = asyncHandler(this.getAllProjects)
    this.getAllProjectsImages = asyncHandler(this.getAllProjectsImages)
    this.addProject = asyncHandler(this.addProject)
    this.editProject = asyncHandler(this.editProject)
    this.deleteProject = asyncHandler(this.deleteProject)
  }

  async getAllProjects(req, res) {
    const projects = await Project.find().lean()
    
    res.status(200).json({
      success: true, 
      message: "Projects retrieved successfully",
      count: projects.length,
      projects: projects,
    })
  }

  async getAllProjectsImages(req, res) {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'projects',
    });
  
    const images = result.resources.map((resource) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      asset_id: resource.asset_id,
    }))
  
    res.json({ 
      success: true,
      message: "Projects images retrieved successfully",
      count: images.length,
      projectImages: images, 
    })
  }
  
  async addProject(req, res) {
    const { name, description, link } = req.body
    
    if (!name || !description || !link) {
      throw new AppError("All fields are required: name, description, link", 400)
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
      link: link
    })
  
    res.status(201).json({
      success: true,
      message: "Project saved successfully",
      project
    })
  }
  
  async editProject (req, res) {
    const { id } = req.params
    const { name, description, preview, link, public_id, asset_id, previewChanged } = req.body
  
    if (!name || !description || !link) {
      throw new AppError("All fields are required: name, description, link", 400)
    }

    const isPreviewChanged = (previewChanged === 'true')
  
    if (isPreviewChanged) {
      //  remmove old project preview from cloudinary
      await cloudinary.uploader.destroy(public_id)
      //  add new project preview to cloudinary
      const uploadingResult =  await cloudinary.uploader.upload(req.file.path, { folder: 'projects' })
        
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          name: name,
          description: description,
          preview: uploadingResult.secure_url,
          public_id: uploadingResult.public_id,
          asset_id: uploadingResult.asset_id,
          link: link
        },
        { new: true, runValidators: true }
      )
  
      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        updatedProject
      })
    }
  
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, preview, link, public_id, asset_id },
      { new: true, runValidators: true }
    )
  
    if (!updatedProject) {
      throw new AppError("Project was not found", 404)
    }
  
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      updatedProject
    })
  }

  async deleteProject(req, res) {
    const { public_id } = req.body

    if (!public_id) {
      throw new AppError("Project public ID is required", 400)
    }

    await cloudinary.uploader.destroy(public_id)
    const projectToDelete = await Project.findByIdAndDelete(req.params.id)
  
    if (!projectToDelete) {
      throw new AppError("Project not found", 404)
    }
  
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully', 
      projectToDelete
    })
  }

  async renderAddProject(req, res) {
    try {
      res.render('projects/addProject', {
        title: 'Add Project',
        user: req.user
      })
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }

  async renderEditProject(req, res) {
    try {
      const project = await Project.findById(req.params.id)
  
      if (!project) 
        return res.status(404).send('Project not found')
    
      res.render('projects/editProject', {
        project: {
          _id: project._id,
          name: project.name,
          description: project.description,
          preview: project.preview,
          link: project.link,
          public_id: project.public_id,
          asset_id: project.asset_id
        },
        title: 'Edit Project',
        user: req.user
      })
    } catch (err) {
      res.status(500).render('error', { message: 'Internal Server Error. Please try again later.' })
    }
  }
}

export default ProjectController