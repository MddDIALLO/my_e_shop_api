import { Request, Response, NextFunction } from 'express';

const addOrderAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole: string = req.user?.role;

    if (userRole && userRole === 'ADMIN') {
        req.addOrderAdmin = true;
        next();
    } else if(userRole && userRole != 'ADMIN') {
        req.addOrderAdmin = false;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied.' });
    }
};

export default addOrderAdmin;
