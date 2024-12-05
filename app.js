import express from "express";
import ejs from "ejs";
import session from "./config/session/session.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import folderRoute from "./routes/folderRoute.js";
import logoutRoute from "./routes/logoutRoute.js";
import passport from "passport";
import { isAuth } from "./utils/isAuth.js";
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const PORT = 3000;
const app = express();

app.engine("html", ejs.renderFile);
app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }));

app.use(session);
import "./config/passport/passport.js";

app.use(passport.initialize());
app.use(passport.session());

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/folder", isAuth, folderRoute);
app.get("/", (req, res) => {
    const userId = req.user ? req.user.id : undefined
    res.render("index.html", { userId: userId });
});
app.use((err, req, res, next) => {
    console.error("ERROR HANDLER", err);
    res.sendStatus(err.statusCode || 500);
});

app.listen(PORT, () => console.log(`listening on http//localhost:${PORT}`));
