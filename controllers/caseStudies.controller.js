import asyncHandler from "express-async-handler"
import { StatusCodes as Status, StatusCodes } from "http-status-codes"
import ApiResponse from '#utils/apiResponse.js'

class CaseStudiesController {
  constructor(caseStudiesService) {
    this.caseStudiesService = caseStudiesService
  }

  getAllCaseStudies = asyncHandler(async (req, res) => {
    const caseStudies = await this.caseStudiesService.getCaseStudies()
    return res.status(Status.OK).json(ApiResponse.successResponse("Case studies retrieved successfully", caseStudies))
  })
}

export default CaseStudiesController
