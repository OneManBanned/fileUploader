import { Router } from "express";
import registerController from "../controllers/registerController.js";

const registerRoute = Router();

registerRoute.get("/", registerController.get)
registerRoute.post("/", registerController.post)

export default registerRoute;
