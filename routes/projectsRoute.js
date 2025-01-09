import express from 'express'
import {
  renderAddProject,
  renderEditProject,
  addProject,
  editProject,
  deleteProject
} from '../controllers/projectController.js'

const router = express.Router()

router.post('/api/add', addProject)
router.post('/api/edit/:id', editProject)
router.delete('/api/delete/:id', deleteProject)

// rendering routes
router.get('/add', renderAddProject)
router.get('/edit/:id', renderEditProject)

export default router
