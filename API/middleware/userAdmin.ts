import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const userRole: string = req.user?.role;
    const id: number = req.user?.id;
    const userId: number = Number(req.params.id);

    if (userRole && userRole === 'ADMIN' || userId === id) {
        req.isAuth = true;
        next();
    } else {
        return res.status(403).send({ message: 'Access denied. Action not authorized.' });
    }
};

export default isAuth;
