import prisma from "../prismaClient/client.js";

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

  // Find queries

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
};

export default db;
