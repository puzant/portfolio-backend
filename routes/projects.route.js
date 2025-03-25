import express from 'express'
import ProjectController from '@controllers/project.controller.js'
import ProjectService from '@services/projectService.js'
import upload from '@middlewares/multerUpload.js'
import authMiddleware from '@middlewares/authMiddleware.js'

const router = express.Router()
const projectService = new ProjectService()
const projectController = new ProjectController(projectService)

router.get('/', projectController.getAllProjects)
router.get('/projects-images', authMiddleware, projectController.getAllProjectsImages)
router.post('/add', authMiddleware, upload.single('preview'), projectController.addProject)
router.post('/edit/:id', authMiddleware, upload.single('preview'), projectController.editProject)
router.delete('/delete/:id', authMiddleware, projectController.deleteProject)

export default router
