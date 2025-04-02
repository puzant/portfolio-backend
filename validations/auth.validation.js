import { body } from "express-validator"

const loginValidation = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email field is required")
    .bail()
    .isString()
    .withMessage("Email should be a string"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password field is required")
]

const createUserValidation = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email field is required"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password field is required"),
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name field is required"),
]

export default { loginValidation, createUserValidation }