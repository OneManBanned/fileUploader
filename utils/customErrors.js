export class CustomUnAuthorizedError extends Error {
    constructor(message) {
        super(message)
        this.name = "AuthenticationError";
        this.statusCode = 401;
    }
}
