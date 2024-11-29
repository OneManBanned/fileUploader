import express from "express"
import ejs from "ejs"
import session from "./config/session/session.js";
import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import passport from "passport";

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

app.get("/", (req, res) => res.render("index.html"))

app.listen(PORT, () => console.log(`listening on http//localhost:${PORT}`))
