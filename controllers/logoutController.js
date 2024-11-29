const logoutController = {
    get: (req, res, next) => {
        req.logout(function(err) {
            if (err) {
                return next(err)
            }

            res.redirect("/")
        }) 
    }
}

export default logoutController;
