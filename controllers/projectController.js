import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"

class ProjectController {
  constructor(logger) {
    this.logger = logger
    this.getAllProjects = this.getAllProjects.bind(this)
    this.getAllProjectsImages = this.getAllProjectsImages.bind(this)
    this.addProject = this.addProject.bind(this)
    this.editProject = this.editProject.bind(this)
    this.deleteProject = this.deleteProject.bind(this)
  }

  async getAllProjects(req, res) {
    try {
      const projects = await Project.find().lean()
      res.status(200).json({
        success: true, 
        message: "Projects retrieved successfully",
        count: projects.length,
        projects: projects,
      })
    } catch (error) {
      this.logger.logError(error)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      })
    }
  }

  async getAllProjectsImages(req, res) {
    try {
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
    } catch(err) {
      this.logger.logError(err)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      })
    }
  }
  
  async addProject(req, res) {
    const { name, description, link } = req.body
    
    if (!name || !description || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, description, link"
      })
    }

    try {
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
    } catch (err) {
      this.logger.logError(err)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
      })
    }
  }
  
  async editProject (req, res) {
    const { id } = req.params
    const { name, description, preview, link, public_id, asset_id, previewChanged } = req.body
  
    if (!name || !description || !link) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, description, link"
      })
    }
    
    try {
      const isPreviewChanged = (previewChanged === 'true');
  
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
        return res.status(404).json({ 
          success: false,
          error: 'Project was not found' 
        })
      }
  
      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        updatedProject
      })
    } catch (err) {
      this.logger.logError(err)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
      })
    }
  }

  async deleteProject(req, res) {
    try {
      const { public_id } = req.body
      await cloudinary.uploader.destroy(public_id)
      const projectToDelete = await Project.findByIdAndDelete(req.params.id)
  
      if (!projectToDelete) 
        return res.status(404).json({ message: 'Project not found' })
  
      res.status(200).json({
        success: true,
        message: 'Project deleted successfully', 
        projectToDelete
      })
    } catch (err) {
      this.logger.logError(err)
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later."
      })
    }
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