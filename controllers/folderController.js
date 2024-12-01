import { validationResult, body, param } from "express-validator";
import { CustomBadRequestError } from "../utils/customErrors.js"
import { createErrorsMap } from "../utils/createErrorsMap.js";
import asyncHandler from "express-async-handler";
import db from "../config/db/queries.js";

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

    delete: [
        validateDelete,
        asyncHandler(async (req, res) => {

            const valid = validationResult(req);

            if (!valid.isEmpty()) {
                throw new CustomBadRequestError()
            }

            await db.deleteFolderById(+req.params.folderId);

            res.redirect(`/folder/${req.user.id}`);
        }),
    ],
};

export default folderController;
