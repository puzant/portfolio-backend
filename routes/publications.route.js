import express from 'express'
import authMiddleware from '@middlewares/authMiddleware.js'
import PublicationService from '@services/publicationService.js'
import PublicationController from '@controllers/publication.controller.js'
import publicationValidation from '@validations/publication.validation.js'

const router = express.Router()
const publicationService = new PublicationService()
const publicationController = new PublicationController(publicationService)

router.get('/', publicationController.getAllPublications)
router.post('/add', authMiddleware, publicationValidation, publicationController.addPublication)
router.post('/edit/:id', authMiddleware, publicationValidation, publicationController.editPublication)
router.delete('/delete/:id', authMiddleware, publicationController.deletePublication)

export default router