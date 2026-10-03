import express from 'express'
import CaseStudiesService from '#services/caseStudies.service.js'
import CaseStudiesController from '#controllers/caseStudies.controller.js'

const router = express.Router()
const caseStudiesService = new CaseStudiesService()
const caseStudiesController = new CaseStudiesController(caseStudiesService)

router.get('/', caseStudiesController.getAllCaseStudies)

export default router
