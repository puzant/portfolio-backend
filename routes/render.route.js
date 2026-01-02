import express from "express"
import { cache } from "../cache.js"
import authMiddleware from "#middlewares/auth.middleware.js"
import restrictTo from '#middlewares/role.middleware.js'

import CMSController from "#controllers/cms.controller.js"
import AuthController from "#controllers/auth.controller.js"
import ProjectController from "#controllers/project.controller.js"
import SettingsController from "#controllers/settings.controller.js"
import PublicationController from "#controllers/publication.controller.js"
import TravelImagesController from '#controllers/travelImage.controller.js'

import ProjectService from "#services/project.service.js"
import SettingsService from "#services/settings.service.js"
import PublicationService from "#services/publication.service.js"
import TravelImageService from '#services/travelImage.service.js'

const router = express.Router()

const projectService = new ProjectService(cache)
const publicationService = new PublicationService(cache)
const travelImageService = new TravelImageService(cache)
const settingsService = new SettingsService()

const cmsController = new CMSController(projectService, publicationService, travelImageService)
const projectController = new ProjectController(projectService)
const settingsController = new SettingsController(settingsService)
const publicationController = new PublicationController(publicationService)
const travelImagesController = new TravelImagesController(travelImageService)
const authController = new AuthController()

router.get('/cms', authMiddleware, cmsController.renderCmsPage)

router.get('/publication/add', authMiddleware, restrictTo('admin'), publicationController.renderAddPublication)
router.get('/publication/edit/:id', authMiddleware, restrictTo('admin'), publicationController.renderEditPublication)

router.get('/projects/add', authMiddleware, restrictTo('admin'), projectController.renderAddProject)
router.get('/projects/edit/:id', authMiddleware, restrictTo('admin'), projectController.renderEditProject)

router.get('/travel-images/add', authMiddleware, restrictTo('admin'), travelImagesController.renderAddTravelImage)
router.get('/travel-images/edit/:id', authMiddleware, restrictTo('admin'), travelImagesController.renderEditTravelImage)

router.get('/login', authController.renderLogin)
router.get('/forgot-password', authController.renderPasswordReset)
router.get('/settings', authMiddleware, restrictTo('admin'), settingsController.renderSettings)

export default router