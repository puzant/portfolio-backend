import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'
import AppError from '#utils/appError.js'
import ApiResponse from '#utils/apiResponse.js'

class ProjectController {
  constructor(projectService) {
    this.projectService = projectService
    this.getAllProjects = asyncHandler(this.getAllProjects.bind(this))
    this.getAllProjectsImages = asyncHandler(this.getAllProjectsImages.bind(this))
    this.addProject = asyncHandler(this.addProject.bind(this))
    this.editProject = asyncHandler(this.editProject.bind(this))
    this.deleteProject = asyncHandler(this.deleteProject.bind(this))
    this.renderAddProject = this.renderAddProject.bind(this)
    this.renderEditProject = this.renderEditProject.bind(this)
    this.reorderProject = this.reorderProject.bind(this)
  }

  async getAllProjects(req, res) {
    const projects = await this.projectService.getAll()
    return res.status(Status.OK).json(ApiResponse.successResponse("Projects retrieved successfully", projects))
  }

  async getAllProjectsImages(req, res) {
    const images = await this.projectService.fetchProjectImages()
    return res.status(Status.OK).json(ApiResponse.successResponse("Projects images retrieved successfully", images))
  }
  
  async addProject(req, res) {
    const project = await this.projectService.addProject(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project saved successfully", project))
  }
  
  async editProject (req, res) {
    const updatedProject = await this.projectService.editProject(req, req.params.id)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project updated successfully", updatedProject))
  }

  async deleteProject(req, res) {
    await this.projectService.deleteProject(req.body.public_id, req.params.id)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project deleted successfully"))
  }

  async reorderProject(req, res) {
    await this.projectService.reorderProject(req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project reordered sucessfully"))
  }

  async renderAddProject(req, res, next) {
    try {
      return res.render('projects/addProject', {
        title: 'Add Project',
        user: req.user
      })
    } catch (err) {
      next(new AppError(err.message, Status.INTERNAL_SERVER_ERROR))
    }
  }

  async renderEditProject(req, res, next) {
    try {
      const project = await this.projectService.getById(req.params.id)
    
      return res.render('projects/editProject', {
        project,
        title: 'Edit Project',
        user: req.user
      })
    } catch (err) {
      next(new AppError(err.message, Status.INTERNAL_SERVER_ERROR))
    }
  }
}

export default ProjectController