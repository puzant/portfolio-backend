import express from 'express'
import upload from '../multerUpload.js'

import {
  renderAddProject,
  renderEditProject,
  addProject,
  editProject,
  deleteProject
} from '../controllers/projectController.js'

const router = express.Router()

router.post('/api/add', upload.single('preview'), addProject)
router.post('/api/edit/:id', editProject)
router.delete('/api/delete/:id', deleteProject)

// rendering routes
router.get('/add', renderAddProject)
router.get('/edit/:id', renderEditProject)

export default router
