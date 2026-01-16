import asyncHandler from 'express-async-handler'
import { StatusCodes as Status } from 'http-status-codes'
import ApiResponse from '#utils/apiResponse.js'

class ProjectController {
  constructor(projectService) {
    this.projectService = projectService
  }

  getAllProjects = asyncHandler(async (req, res) => {
    const projects = await this.projectService.getAll()
    return res.status(Status.OK).json(ApiResponse.successResponse("Projects retrieved successfully", projects))
  }
)
  getAllProjectsImages = asyncHandler(async (req, res) => {
    const images = await this.projectService.fetchProjectImages()
    return res.status(Status.OK).json(ApiResponse.successResponse("Projects images retrieved successfully", images))
  })
  
  addProject = asyncHandler(async (req, res) => {
    const project = await this.projectService.addProject(req)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project saved successfully", project))
  })
  
  editProject = asyncHandler(async (req, res) => {
    const updatedProject = await this.projectService.editProject(req, req.params.id)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project updated successfully", updatedProject))
  })

  deleteProject = asyncHandler(async (req, res) => {
    await this.projectService.deleteProject(req.body.public_id, req.params.id)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project deleted successfully"))
  })

  reorderProject = asyncHandler(async (req, res) => {
    await this.projectService.reorderProject(req.body)
    return res.status(Status.OK).json(ApiResponse.successResponse("Project reordered sucessfully"))
  })

  renderAddProject = asyncHandler(async (req, res) => {
    return res.render('projects/addProject', {
      title: 'Add Project',
    })
  })

  renderEditProject = asyncHandler(async (req, res) => {
    const project = await this.projectService.getById(req.params.id)
    
    return res.render('projects/editProject', {
      project,
      title: 'Edit Project',
    })
  })
}

export default ProjectController