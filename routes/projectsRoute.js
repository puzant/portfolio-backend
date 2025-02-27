import express from 'express'
import ProjectController from '../controllers/projectController.js'
import upload from '../middlewares/multerUpload.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import logger from '../logger.js'

const router = express.Router()
const projectController = new ProjectController(logger)

//  API routes
router.get('/api', projectController.getAllProjects)
router.get('/api/projects-images', authMiddleware, projectController.getAllProjectsImages)
router.post('/api/add', authMiddleware, upload.single('preview'), projectController.addProject)
router.post('/api/edit/:id', authMiddleware, upload.single('preview'), projectController.editProject)
router.delete('/api/delete/:id', authMiddleware, projectController.deleteProject)

// rendering routes
router.get('/add', authMiddleware, projectController.renderAddProject)
router.get('/edit/:id', authMiddleware, projectController.renderEditProject)

export default router
