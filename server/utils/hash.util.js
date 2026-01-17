import bcrypt from 'bcrypt';

async function hashPassword(password, saltRounds = process.env.SALT_ROUNDS || 10) {
    const hashedPassword = bcrypt.hash(password, parseInt(saltRounds));
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

export { hashPassword, verifyPassword };