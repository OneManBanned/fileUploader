import exportSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "../prismaClient/client.js";

const session = exportSession({
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 
    },
    secret: process.env.SESSIONSECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
        }
    )
});

export default session;
