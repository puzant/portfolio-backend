import express from 'express'
import PublicationController from '../controllers/publicationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import logger from '../logger.js'

const router = express.Router()
const publicationController = new PublicationController(logger)

// API routes
router.get('/api', publicationController.getAllPublications)
router.post('/api/add', authMiddleware, publicationController.addPublication)
router.post('/api/edit/:id', authMiddleware, publicationController.editPublication)
router.delete('/api/delete/:id', authMiddleware, publicationController.deletePublication)

// rendering routes
router.get('/add', authMiddleware, publicationController.renderAddPublication)
router.get('/edit/:id', authMiddleware, publicationController.renderEditPublication)

export default router