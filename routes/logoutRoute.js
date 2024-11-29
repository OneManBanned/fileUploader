import { Router } from "express";
import logoutController from "../controllers/logoutController.js"

const logoutRoute = Router();

logoutRoute.get("/", logoutController.get)

export default logoutRoute;
