import passport from "passport";
import localStrategy from "passport-local";
import db from "../db/queries.js";
import { validatePassword } from "../../libs/passportUtils.js";

const customFields = {
    usernameField: "email",
    passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
    try {
        const user = await db.findUniqueUserByEmail(username);

        if (!user) return done(null, false);

        const isValid = validatePassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user); // if pw is valid return user
        } else {
            return done(null, false); // if pw is not valid return false
        }
    } catch(err) {
        done(err);
    }
};

const strategy = new localStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await db.findUserById(userId);
        done(null, user);
    } catch(err) {
        done(err);
    }
});
