import { Router } from "express";
import uploadController from "../controllers/uploadController.js";

const uploadRoute = Router();

uploadRoute.get("/", uploadController.get);
uploadRoute.post("/", uploadController.post);

export default uploadRoute;
