import passport from "passport";
import asyncHandler from "express-async-handler";
import localStrategy from "passport-local";
import prisma from "../prismaClient/client.js";
import { validatePassword } from "../../libs/passportUtils.js";

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = asyncHandler(async (username, password, done) => {
  const user = await prisma.user.findUnique({
    where: {
      email: username,
    },
  }); // find user in db

  if (!user) return done(null, false); // if no user found return false

  const isValid = validatePassword(password, user.hash, user.salt); // check user entered pw against hash and salt saved in db

  if (isValid) {
    return done(null, user); // if pw is valid return user
  } else {
    return done(null, false); // if pw is not valid return false
  }
});

const strategy = new localStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(asyncHandler(async (userId, done) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    done(null, user);
}));
