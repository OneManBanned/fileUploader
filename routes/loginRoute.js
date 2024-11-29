import { Router } from "express";
import loginController from "../controllers/loginController.js";
import passport from "passport";

const loginRoute = Router();

loginRoute.get("/", loginController.get)
loginRoute.post("/", passport.authenticate('local', {failureRedirect: '/', successRedirect: '/'}))

export default loginRoute;
