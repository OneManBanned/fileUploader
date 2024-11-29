import { Router } from "express";
import loginController from "../controllers/loginController.js";

const loginRoute = Router();

loginRoute.get("/", loginController.get)

export default loginRoute;
