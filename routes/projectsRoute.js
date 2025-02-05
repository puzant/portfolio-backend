import express from 'express'

import {
  renderAddProject,
  renderEditProject,
  getAllProjects,
  getAllProjectsImages,
  addProject,
  editProject,
  deleteProject
} from '../controllers/projectController.js'
import upload from '../middlewares/multerUpload.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

//  API routes
router.get('/api', getAllProjects)
router.get('/api/projects-images', authMiddleware, getAllProjectsImages)
router.post('/api/add', authMiddleware, upload.single('preview'), addProject)
router.post('/api/edit/:id', authMiddleware, upload.single('preview'), editProject)
router.delete('/api/delete/:id', authMiddleware, deleteProject)

// rendering routes
router.get('/add', authMiddleware, renderAddProject)
router.get('/edit/:id', authMiddleware, renderEditProject)

export default router
