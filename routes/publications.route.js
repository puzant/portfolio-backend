import express from 'express'
import authMiddleware from '#middlewares/auth.middleware.js'
import restrictTo from '#middlewares/role.middleware.js'
import PublicationService from '#services/publication.service.js'
import PublicationController from '#controllers/publication.controller.js'
import publicationValidation from '#validations/publication.validation.js'

const router = express.Router()
const publicationService = new PublicationService()
const publicationController = new PublicationController(publicationService)

router.get('/', publicationController.getAllPublications)
router.post('/add', authMiddleware, restrictTo('admin'), publicationValidation, publicationController.addPublication)
router.post('/edit/:id', authMiddleware, restrictTo('admin'), publicationValidation, publicationController.editPublication)
router.delete('/delete/:id', authMiddleware, restrictTo('admin'), publicationController.deletePublication)

export default router