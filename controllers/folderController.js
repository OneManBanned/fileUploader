import { validationResult, body, param } from "express-validator";
import { CustomBadRequestError } from "../utils/customErrors.js";
import { createErrorsMap } from "../utils/createErrorsMap.js";
import { __dirname } from "../app.js";
import asyncHandler from "express-async-handler";
import db from "../config/db/queries.js";
import multer from "multer";
import supabase from "../config/prismaClient/supabaseClient.js";
import pkg from "base64-arraybuffer";

const { decode } = pkg;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = upload.single("files");

const validateFolder = [
  body("name").trim().exists({ values: "falsy" }).withMessage("required"),
];

const validateDelete = [param("folderId").exists({ values: "falsy" })];

const folderController = {
  get: async (req, res) => {
    const user = await db.findUserWithFolders(+req.params.userId);
    res.render("folder.html", { folders: user.folders, userId: req.user.id });
  },

  getCreate: (req, res) => {
    res.render("create.html", { userId: req.user.id, errors: {} });
  },

  getEdit: async (req, res) => {
    const folder = await db.findFolderById(+req.params.folderId);
    res.render("edit.html", {
      values: folder,
      folderId: req.params.folderId,
      errors: {},
    });
  },

  getFolder: async (req, res) => {
    const folder = await db.findFolderById(+req.params.folderId);
    res.render("upload.html", { folder: folder });
  },

  getFile: async (req, res) => {
    const file = await db.findFileById(+req.params.fileId);
    res.render("file.html", { file: file });
  },

  postCreate: [
    validateFolder,
    asyncHandler(async (req, res, next) => {
      const valid = validationResult(req);

      if (!valid.isEmpty()) {
        res.render("create.html", {
          userId: req.user.id,
          errors: createErrorsMap(valid.errors),
          values: req.body,
        });
        next();
      }

      await db.createFolder(req.body.name, +req.user.id);

      res.redirect(`/folder/${req.user.id}`);
    }),
  ],

  postEdit: [
    validateFolder,
    asyncHandler(async (req, res, next) => {
      const valid = validationResult(req);

      if (!valid.isEmpty()) {
        res.render("edit.html", {
          folderId: req.params.folderId,
          errors: createErrorsMap(valid.errors),
          values: req.body,
        });
        next();
      }

      await db.updateFolderById(+req.params.folderId, req.body.name);

      res.redirect(`/folder/${req.user.id}`);
    }),
  ],

  postFile: [
    uploadMiddleware,
    asyncHandler(async (req, res, next) => {
      const dataArr = [];

      console.log(req.file);

      if (!req.file) {
        res.status(400).json({ message: "Please upload a file" });
        return;
      }

      const { originalname, size, buffer } = req.file;
      const { folderId } = req.params;

      console.log(req.file);

      const fileBase64 = decode(buffer.toString("base64"));

      const { data, error } = await supabase.storage.from("files").upload(originalname, fileBase64);

      if (error) {
        console.error("SUPABASE ERROR: ", error);
      }

      if (data) {
        console.log(data);
      }

      let fileInfo = {
        originalName: originalname,
        size: size,
        folderId: +folderId,
        path: "",
      };

      dataArr.push(fileInfo);

      await db.createFile(dataArr);

      res.redirect(req.get("referer"));
    }),
  ],

  downloadFile: asyncHandler(async (req, res) => {
    const { path } = await db.getFilePath(+req.params.fileId);
    const file = `${__dirname}/${path}`;
    res.download(file);
  }),

  delete: [
    validateDelete,
    asyncHandler(async (req, res) => {
      const valid = validationResult(req);

      if (!valid.isEmpty()) {
        throw new CustomBadRequestError();
      }

      await db.deleteFolderById(+req.params.folderId);

      res.redirect(`/folder/${req.user.id}`);
    }),
  ],
};

export default folderController;
