import express from 'express'
import { 
  getAllPublications, 
  addPublication, 
  editPublication, 
  deletePublication,
  renderAddPublication,
  renderEditPublication
} from '../controllers/publicationController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

// API routes
router.get('/api', getAllPublications)
router.post('/api/add', authMiddleware, addPublication)
router.post('/api/edit/:id', authMiddleware, editPublication)
router.delete('/api/delete/:id', authMiddleware, deletePublication)

// rendering routes
router.get('/add', authMiddleware, renderAddPublication)
router.get('/edit/:id', authMiddleware, renderEditPublication)

export default router