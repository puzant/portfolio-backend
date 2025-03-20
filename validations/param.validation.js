import { param } from "express-validator"

const paramValidation = [
  param("id")
    .exists()
    .withMessage("ID parameter is required")
    .bail()
    .isInt()
    .withMessage("ID must be an integer")
]

export default paramValidation