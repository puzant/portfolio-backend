import express from 'express'
import upload from '../multerUpload.js'

import {
  renderAddProject,
  renderEditProject,
  getAllProjects,
  getAllProjectsImages,
  addProject,
  editProject,
  deleteProject
} from '../controllers/projectController.js'

const router = express.Router()

//  API routes
router.get('/api', getAllProjects)
router.get('/api/projects-images', getAllProjectsImages)
router.post('/api/add', upload.single('preview'), addProject)
router.post('/api/edit/:id', upload.single('preview'), editProject)
router.delete('/api/delete/:id', deleteProject)

// rendering routes
router.get('/add', renderAddProject)
router.get('/edit/:id', renderEditProject)

export default router
