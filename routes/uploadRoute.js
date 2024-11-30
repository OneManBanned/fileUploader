import { Router } from "express";
import uploadController from "../controllers/uploadController.js";
import multer from "multer";

const uploadRoute = Router();
const upload = multer({dest: "uploads/"})

uploadRoute.get("/", uploadController.get);
uploadRoute.post("/", upload.single('file'), uploadController.post);

export default uploadRoute;
