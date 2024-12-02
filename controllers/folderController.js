import { validationResult, body, param } from "express-validator";
import { CustomBadRequestError } from "../utils/customErrors.js";
import { createErrorsMap } from "../utils/createErrorsMap.js";
import asyncHandler from "express-async-handler";
import db from "../config/db/queries.js";
import multer from "multer";

const upload = multer({dest: 'uploads/'})

const uploadMiddleware = upload.array('files', 12)

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
        const file = await db.findFileById(+req.params.fileId)
        res.render("file.html", {file: file})
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
        asyncHandler(async (req, res) => {
            console.log("ROUTE HIT", req.files, req.params );

            const data = [];

            req.files.forEach(file => {
                let fileInfo = {originalName: file.originalname, path: file.path, size: file.size, folderId: +req.params.folderId}
                data.push(fileInfo)
            })

            await db.createManyFiles(data)

            res.redirect(`/folder/${req.user.id}`);
        }),
    ],

    // delete queries

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
