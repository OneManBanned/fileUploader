const uploadController = {
    get: (req, res) => {
        res.render("upload.html")
    },

    post: (req, res) => {
        console.log(req.body)
    }
}

export default uploadController;
