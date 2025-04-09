import { body, check } from "express-validator"
import { StatusCodes as Status } from "http-status-codes"
import AppError from "#utils/appError.js"

const projectValidation = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name field is required")
    .bail()
    .isString()
    .withMessage("Name should be string"),
  body("description")
    .exists({ checkFalsy: true })
    .withMessage("Description field is required")
    .bail()
    .isString()
    .withMessage("Description should be string"),
  body("link")
    .exists({ checkFalsy: true })
    .withMessage("Link field is required")
    .bail()
    .isString()
    .withMessage("Link should be string"),
  check("file")
    .custom((value, { req,  }) => {
      if (!req.file || !req.file.path) {
        throw new AppError("Preview is required", Status.BAD_REQUEST)
      }

      return true
    })
]

export default projectValidation