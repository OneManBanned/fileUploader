const uploadController = {
    get: (req, res) => {
        res.render("upload.html")
    },

    post: (req, res) => {
        console.log(req.body)
        console.log(req.file)

        res.redirect('/')
    }
}

export default uploadController;
