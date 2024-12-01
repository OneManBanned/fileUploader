export class CustomUnAuthorizedError extends Error {
    constructor(message) {
        super(message)
        this.name = "AuthenticationError";
        this.statusCode = 401;
    }
}

export class CustomBadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = "BadRequest";
        this.statusCode = 400;
    }
}
