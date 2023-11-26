import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole: number = req.user?.role_id;

    if (userRole && userRole === 1) {
        req.isAdmin = true;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied. Admin role required.' });
    }
};

export default isAdmin;
