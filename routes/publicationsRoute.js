import express from 'express'
import { 
  getAllPublications, 
  addPublication, 
  editPublication, 
  deletePublication,
  renderAddPublication,
  renderEditPublication
} from '../controllers/publicationController.js'

const router = express.Router()

router.get('/api', getAllPublications)
router.post('/api/add', addPublication)
router.post('/api/edit/:id', editPublication)
router.delete('api/delete/:id', deletePublication)

// rendering routes
router.get('/add', renderAddPublication)
router.get('/edit/:id', renderEditPublication)

export default router