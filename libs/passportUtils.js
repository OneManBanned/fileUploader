import bcrypt from "bcryptjs"

export function genPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const genHash = bcrypt.hashSync(password, salt)

    return {
        salt: salt, 
        hash: genHash
    }
}

export function validatePassword(password, hash, salt) {
    const hashVerify = bcrypt.hashSync(password, salt)
    return hash === hashVerify;
}
