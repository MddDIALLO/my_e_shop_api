import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const userRole: number = req.user?.role_id;
    const id: number = req.user?.id;
    const userId: number = Number(req.params.id);

    if (userRole && userRole === 1 || userId === id) {
        req.isAuth = true;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied. Action not authorized.' });
    }
};

export default isAuth;
