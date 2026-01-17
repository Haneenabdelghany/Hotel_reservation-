import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

const createToken = (payload, options = {}) => {
    const {
        expiresIn = '7d',
        secret = process.env.JWT_SECRET,
        algorithm = 'HS256',
        issuer = process.env.JWT_ISSUER,
        audience = process.env.JWT_AUDIENCE
    } = options;

    if (!secret) throw new Error('JWT_SECRET missing in environment');

    const tokenPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        iss: issuer,
        aud: audience
    };

    return jwt.sign(tokenPayload, secret, {
        expiresIn,
        algorithm,
    });
};

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: "Authorization header missing",
                message: "Unauthorized request"
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: "Invalid token format",
                message: "Token must be in format: Bearer <token>"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.iss !== process.env.JWT_ISSUER ||
            decoded.aud !== process.env.JWT_AUDIENCE) {
            return res.status(403).json({
                success: false,
                error: "Invalid token claims",
                message: "Unauthorized request"
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: "Token expired",
                message: "Session expired, please login again.",
                expiredAt: error.expiredAt
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
                message: "Unauthorized request"
            });
        }

        console.error('Token verification failed:', error);
        return res.status(500).json({
            success: false,
            error: "Authentication failure",
            message: "Internal server error"
        });
    }
};

export { generateSecretKey, createToken, verifyToken };