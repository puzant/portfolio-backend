import express from 'express'
import { cache } from '../cache.js'
import ProjectController from '#controllers/project.controller.js'
import ProjectService from '#services/project.service.js'
import upload from '#middlewares/multerUpload.middleware.js'
import authMiddleware from '#middlewares/auth.middleware.js'
import restrictTo from '#middlewares/role.middleware.js'
import projectValidation from '#validations/project.validation.js'

const router = express.Router()
const projectService = new ProjectService(cache)
const projectController = new ProjectController(projectService)

router.get('/', projectController.getAllProjects)
router.get('/projects-images', authMiddleware, projectController.getAllProjectsImages)
router.post('/add', authMiddleware, restrictTo('admin'), upload.single('preview'), projectValidation, projectController.addProject)
router.post('/edit/:id', authMiddleware, restrictTo('admin'), upload.single('preview'), projectValidation, projectController.editProject)
router.post('/reorder-project', authMiddleware, restrictTo('admin'), projectController.reorderProject)
router.delete('/delete/:id', authMiddleware, restrictTo('admin'), projectController.deleteProject)

export default router
