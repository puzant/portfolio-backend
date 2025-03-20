import { body } from "express-validator"

const publicationValidation = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title field is required")
    .bail()
    .isString()
    .withMessage("Title should be string"),
  body("publishedDate")
    .exists({ checkFalsy: true })
    .withMessage("Published date field is required")
    .bail()
    .isString()
    .withMessage("Published date should be string"),
  body("link")
    .exists({ checkFalsy: true })
    .withMessage("Link field is required")
    .bail()
    .isString()
    .withMessage("Link should be string"),
  body("duration")
    .exists({ checkFalsy: true })
    .withMessage("Duration field is required")
    .bail()
    .isString()
    .withMessage("Duration should be string"),
  body("preview")
    .exists({ checkFalsy: true })
    .withMessage("Preview field is required")
    .bail()
    .isString()
    .withMessage("Preview should be string"),
]

export default publicationValidation