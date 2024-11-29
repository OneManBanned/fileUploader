import { CustomUnAuthorizedError } from "./customErrors.js"

export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        throw new CustomUnAuthorizedError()
    }
}
