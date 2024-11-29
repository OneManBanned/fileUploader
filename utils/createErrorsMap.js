export function createErrorsMap(errors) {
    const errorsObj = {};
    for (let error of errors) {
        errorsObj[error.path] = error.msg;
    }
    return errorsObj;
}

