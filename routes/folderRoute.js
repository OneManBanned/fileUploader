import { Router } from "express";
import folderController from "../controllers/folderController.js";

const folderRoute = Router();

folderRoute.get("/:userId", folderController.get);

folderRoute.get("/upload/:folderId", folderController.getFolder);
folderRoute.post("/upload/:folderId", folderController.postFile);

folderRoute.get("/file/:fileId", folderController.getFile)

folderRoute.get("/create/:userId", folderController.getCreate);
folderRoute.post("/create/:userId", folderController.postCreate);

folderRoute.get("/edit/:folderId", folderController.getEdit);
folderRoute.post("/edit/:folderId", folderController.postEdit);

folderRoute.post("/delete/:folderId", folderController.delete);

export default folderRoute;
