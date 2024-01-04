import { Request, Response, NextFunction } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole: string = req.user?.role;

    if (userRole && userRole === 'ADMIN') {
        req.isAdmin = true;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied. Admin role required.' });
    }
};

export default isAdmin;
