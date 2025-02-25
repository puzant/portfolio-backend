import express from 'express'
import PublicationController from '../controllers/publicationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import logger from '../logger.js'

const router = express.Router()
const publicationController = new PublicationController(logger)

// API routes
router.get('/api', publicationController.getAllPublications.bind(publicationController))
router.post('/api/add', authMiddleware, publicationController.addPublication.bind(publicationController))
router.post('/api/edit/:id', authMiddleware, publicationController.editPublication.bind(publicationController))
router.delete('/api/delete/:id', authMiddleware, publicationController.deletePublication.bind(publicationController))

// rendering routes
router.get('/add', authMiddleware, publicationController.renderAddPublication)
router.get('/edit/:id', authMiddleware, publicationController.renderEditPublication)

export default router