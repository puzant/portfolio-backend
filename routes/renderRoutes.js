import express from "express"
import authMiddleware from "#middlewares/authMiddleware.js"
import AuthController from "#controllers/auth.controller.js"
import ProjectController from "#controllers/project.controller.js"
import SettingsController from "#controllers/settings.controller.js"
import PublicationController from "#controllers/publication.controller.js"

import ProjectService from "#services/projectService.js"
import SettingsService from "#services/settingsService.js"
import PublicationService from "#services/publicationService.js"

const router = express.Router()

const authController = new AuthController()
const projectService = new ProjectService()
const settingsService = new SettingsService()
const publicationService = new PublicationService()

const projectController = new ProjectController(projectService)
const settingsController = new SettingsController(settingsService)
const publicationController = new PublicationController(publicationService)

router.get('/publication/add', authMiddleware, publicationController.renderAddPublication)
router.get('/publication/edit/:id', authMiddleware, publicationController.renderEditPublication)

router.get('/projects/add', authMiddleware, projectController.renderAddProject)
router.get('/projects/edit/:id', authMiddleware, projectController.renderEditProject)

router.get('/login', authController.renderLogin)
router.get('/settings', authMiddleware, settingsController.renderSettings)


export default router