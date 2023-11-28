import { Request, Response, NextFunction } from 'express';

const addOrderAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userRole: number = req.user?.role_id;

    if (userRole && userRole === 1) {
        req.addOrderAdmin = true;
        next();
    } else if(userRole && userRole != 1) {
        req.addOrderAdmin = false;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied.' });
    }
};

export default addOrderAdmin;
