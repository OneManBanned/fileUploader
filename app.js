import express from "express"

const PORT = 3000
const app = express();

app.get("/", (req, res) => res.send("Hello App"))

app.listen(PORT, () => console.log(`listening on http//localhost:${PORT}`))
