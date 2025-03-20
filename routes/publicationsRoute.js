import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import PublicationService from '../services/publicationService.js'
import PublicationController from '../controllers/publicationController.js'
import publicationValidation from '../validations/publication.validation.js'

const router = express.Router()
const publicationService = new PublicationService()
const publicationController = new PublicationController(publicationService)

// API routes
router.get('/api', publicationController.getAllPublications)
router.post('/api/add', authMiddleware, publicationValidation, publicationController.addPublication)
router.post('/api/edit/:id', authMiddleware, publicationValidation, publicationController.editPublication)
router.delete('/api/delete/:id', authMiddleware, publicationController.deletePublication)

// rendering routes
router.get('/add', authMiddleware, publicationController.renderAddPublication)
router.get('/edit/:id', authMiddleware, publicationController.renderEditPublication)

export default router