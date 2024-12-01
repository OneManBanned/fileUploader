import express from "express"
import ejs from "ejs"
import session from "./config/session/session.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import folderRoute from "./routes/folderRoute.js";
import logoutRoute from "./routes/logoutRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import passport from "passport";
import { isAuth } from "./utils/isAuth.js";

const PORT = 3000
const app = express();

app.engine("html", ejs.renderFile);

app.use(express.urlencoded({ extended: true }));

app.use(session)
import "./config/passport/passport.js";

app.use(passport.initialize());
app.use(passport.session());

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/logout", logoutRoute)
app.use("/upload", isAuth, uploadRoute)
app.use("/folder", isAuth, folderRoute)
app.get("/", (req, res) => res.render("index.html", {userId: req.user.id}))
app.use((err, req, res, next) => {
    console.error("ERROR HANDLER", err)
    res.status(err.statusCode || 500).send(err.statusCode);
})

app.listen(PORT, () => console.log(`listening on http//localhost:${PORT}`))
