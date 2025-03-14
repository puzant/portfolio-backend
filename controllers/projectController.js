import asyncHandler from 'express-async-handler'
import Project from "../models/project.js"
import ProjectService from '../services/projectService.js'

class ProjectController {
  constructor() {
    this.projectService = new ProjectService()

    this.getAllProjects = asyncHandler(this.getAllProjects.bind(this))
    this.getAllProjectsImages = asyncHandler(this.getAllProjectsImages.bind(this))
    this.addProject = asyncHandler(this.addProject.bind(this))
    this.editProject = asyncHandler(this.editProject.bind(this))
    this.deleteProject = asyncHandler(this.deleteProject.bind(this))
    this.renderAddProject = this.renderAddProject.bind(this)
    this.renderEditProject = this.renderEditProject.bind(this)
  }

  async getAllProjects(req, res) {
    const projects = await this.projectService.getAll()
    
    res.status(200).json({
      success: true, 
      message: "Projects retrieved successfully",
      count: projects.length,
      projects: projects,
    })
  }

  async getAllProjectsImages(req, res) {
    const images = await this.projectService.fetchProjectImages()

    res.json({ 
      success: true,
      message: "Projects images retrieved successfully",
      count: images.length,
      projectImages: images, 
    })
  }
  
  async addProject(req, res) {

    const project = await ProjectService.addProject(req.body, req.file.path)

    res.status(201).json({
      success: true,
      message: "Project saved successfully",
      project
    })
  }
  
  async editProject (req, res) {
    const updatedProject = await this.projectService.editProject(req.body, req.params.id, req.file.path)
 
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      updatedProject
    })
  }

  async deleteProject(req, res) {
    await this.projectService.deleteProject(req.body.public_id, req.params.id)
  
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully', 
    })
  }

  async renderAddProject(req, res, next) {
    try {
      res.render('projects/addProject', {
        title: 'Add Project',
        user: req.user
      })
    } catch (err) {
      next(new AppError(err.message, 500))
    }
  }

  async renderEditProject(req, res, next) {
    try {
      const project = await this.projectService.getById(req.params.id)
    
      res.render('projects/editProject', {
        project,
        title: 'Edit Project',
        user: req.user
      })
    } catch (err) {
      next(new AppError(err.message, 500))
    }
  }
}

export default ProjectController