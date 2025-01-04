import express from 'express'
import { 
  getAllPublications, 
  addPublication, 
  editPublication, 
  deletePublication 
} from '../controllers/publicationController.js'

const router = express.Router()

router.get('/', getAllPublications)
router.get('/', addPublication)
router.get('/', editPublication)
router.get('/', deletePublication)

export default router