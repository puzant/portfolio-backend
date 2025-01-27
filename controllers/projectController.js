import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().lean()
    res.status(200).json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

export const getAllProjectsImages = async (req, res) => {
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

    res.json({ projectImages: images, success: true })
  } catch(err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const addProject = async (req, res) => {
  const { name, description, link } = req.body

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'projects'
    })

    Project.create({
      name: name,
      description: description,
      preview: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
      link: link
    })

  res.status(200).json({ message: 'Project saved successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const editProject = async (req, res) => {
  const { id } = req.params
  const { name, description, preview, link, public_id, asset_id, previewChanged } = req.body

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

      return res.json({
        success: 'Publication updated successfully!',
        data: updatedProject
      })
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, preview, link, public_id, asset_id },
      { new: true, runValidators: true }
    )

    if (!updatedProject) {
      return res.status(404).json({ error: 'Document not found' })
    }

    res.json({
      success: 'Publication updated successfully!',
      data: updatedProject
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteProject = async (req, res) => {}

export const renderAddProject = async (req, res) => {
  res.render('project/addProject', {
    title: 'Add Project'
  })
}

export const renderEditProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) 
      return res.status(404).send('Project not found')
  
    res.render('project/editProject', {
      project: {
        _id: project._id,
        name: project.name,
        description: project.description,
        preview: project.preview,
        link: project.link,
        public_id: project.public_id,
        asset_id: project.asset_id
      },
      title: 'Edit Project'
    })
  } catch (err) {
    
  }
}
