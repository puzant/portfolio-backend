import { v2 as cloudinary } from 'cloudinary'
import Project from "../models/project.js"

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
      link: link
    })

  res.status(200).json({ message: 'Project saved successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const editProject = async (req, res) => {
  const { id } = req.params
  const { name, description, preview, link } = req.body

  try {
    const updateProject = await Project.findByIdAndUpdate(
      id,
      { name, description, preview, link },
      { new: true, runValidators: true }
    )

    if (!updateProject) {
      return res.status(404).json({ error: 'Document not found' })
    }

    res.json({
      success: 'Publication updated successfully!',
      data: updateProject
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
        link: project.link
      },
      title: 'Edit Project'
    })
  } catch (err) {
    
  }
}
