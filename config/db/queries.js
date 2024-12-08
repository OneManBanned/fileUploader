import prisma from "../clients/prismaClient.js";

const db = {
    // Create queries

    createUser: async (username, email, hash, salt) => {
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                hash: hash,
                salt: salt,
            },
        });
    },

    createFolder: async (name, id) => {
        await prisma.folder.create({
            data: {
                name: name,
                ownerId: id,
            },
        });
    },

    createFile: async (name, size, folderId, url) => {
        await prisma.file.create({
            data: {
                    originalName: name,
                    size: size,
                    folderId: +folderId,
                    path: url,
                },
            
        });
    },

    // Delete queries

    deleteFolderById: async (id) => {
        await prisma.folder.delete({
            where: {
                id: +id,
            },
        });
    },

    // Find queries

    getFilePath: async (id) => {
        return await prisma.file.findUnique({
            where: {
                id: id,
            },
            select: {
                path: true,
            },
        });
    },

    findUserById: async (id) => {
        return await prisma.user.findFirst({
            where: {
                id: id,
            },
        });
    },

    findUniqueUserByEmail: async (username) => {
        return await prisma.user.findUnique({
            where: {
                email: username,
            },
        });
    },

    findUserWithFolders: async (id) => {
        return await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                folders: true,
            },
        });
    },

    findFolderById: async (id) => {
        return await prisma.folder.findUnique({
            where: {
                id: id,
            },
            include: {
                files: true,
            },
        });
    },

    findFileById: async (id) => {
        return await prisma.file.findUnique({
            where: {
                id: id,
            },
        });
    },

    updateFolderById: async (id, name) => {
        await prisma.folder.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            },
        });
    },
};

export default db;
