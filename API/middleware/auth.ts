const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any;
            isAdmin?: boolean;
            isAuth?: boolean;
            isAuthToManRole?: boolean;
            isAuthToManOrder?: boolean;
            addOrderAdmin?:boolean;
            updateOrderAdmin?:boolean;
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Access token not found' });
    }

    const secretKey = process.env.JWT_SECRET || 'default_secret_key';

    jwt.verify(token, secretKey, (err, decoded: any) => {
        if (err) {
            return res.status(403).send({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

export default authenticateToken;
