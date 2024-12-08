import { validationResult, body, param } from "express-validator";
import { CustomBadRequestError } from "../utils/customErrors.js";
import { createErrorsMap } from "../utils/createErrorsMap.js";
import { v2 as cloudinary } from "cloudinary";
import { __dirname } from "../app.js";
import asyncHandler from "express-async-handler";
import db from "../config/db/queries.js";
import multer from "multer";

cloudinary.config({
    cloud_name: "dt1jooy8f",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

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
            if (!req.file) throw new CustomBadRequestError("Please upload a file");

            const { originalname, size, path } = req.file;
            const { folderId } = req.params;

            const url = await storeFileIn(cloudinary, `${__dirname}/${path}`);

            await db.createFile(originalname, size, folderId, url);

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

            if (!valid.isEmpty()) throw new CustomBadRequestError();

            await db.deleteFolderById(+req.params.folderId);

            res.redirect(`/folder/${req.user.id}`);
        }),
    ],
};

export default folderController;

async function storeFileIn(service, filePath) {
    const results = await service.uploader.upload(filePath);
    const url = service.url(results.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto",
            },
        ],
    });

    return url;
}
/*
{
  asset_id: 'cdef98098fedf197d1218c5187203368',
  public_id: 'gswz7oepkhtbwiisnxyz',
  version: 1733652188,
  version_id: 'b8cfadef150769f59465d917c34865d9',
  signature: 'f0415adae3f5331ea43d19dcfc2a0d3841d910af',
  width: 3024,
  height: 4032,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2024-12-08T10:03:08Z',
  tags: [],
  bytes: 3999555,
  type: 'upload',
  etag: '501c8ea74ad1f5871d8c2d7b0a40f358',
  placeholder: false,
  url: 'http://res.cloudinary.com/dt1jooy8f/image/upload/v1733652188/gswz7oepkhtbwiisnxyz.jpg',
  secure_url: 'https://res.cloudinary.com/dt1jooy8f/image/upload/v1733652188/gswz7oepkhtbwiisnxyz.jpg',
  folder: '',
  original_filename: '0e40fd69b64ff62f5c01ab62fd0fe0b3',
  api_key: '142684562959928'
}
*/
