import prisma from "../config/prismaClient/client.js";
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
        const errors = createErrorsMap(valid.errors);
        res.render("register.html", { errors: errors, values: req.body });
      } else {
        const { username, email, password } = req.body;

          const saltHash = genPassword(password)

        const salt = saltHash.salt
        const hash = saltHash.hash

          console.log(salt, " ", typeof salt, "\n", hash, " ", typeof hash)

        const user = await prisma.user.create({
          data: {
            username: username,
            email: email,
            hash: hash,
            salt: salt,
          },
        });

          console.log(user)

        res.redirect("/login");
      }
    }),
  ],
};

export default registerController;
