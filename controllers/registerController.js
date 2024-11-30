import db from "../config/db/queries.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { createErrorsMap } from "../utils/createErrorsMap.js";
import { genPassword } from "../libs/passportUtils.js";

const validateRegister = [
  body("username").trim().notEmpty().withMessage("required"),
  body("email").trim().notEmpty().withMessage("required"),
  body("password").trim().notEmpty().withMessage("required"),
  body("confirmPassword").trim().notEmpty().withMessage("required"),
];

const registerController = {
  get: (req, res) => {
    res.render("register.html", { errors: {}, values: {} });
  },

  post: [
    validateRegister,
    asyncHandler(async (req, res) => {
      const valid = validationResult(req);

      if (!valid.isEmpty()) {
        res.render("register.html", {
          errors: createErrorsMap(valid.errors),
          values: req.body,
        });
      } else {
        const { username, email, password } = req.body;

        const saltHash = genPassword(password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;

        await db.createUser(username, email, hash, salt);

        res.redirect("/login");
      }
    }),
  ],
};

export default registerController;
