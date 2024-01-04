import { Request, Response, NextFunction } from 'express';

const isAuthToManRole = (req: Request, res: Response, next: NextFunction) => {
    const userRole: string = req.user?.role;
    const id: number = req.user?.id;
    const userId: number = Number(req.params?.id);

    if(req.isAuth) {
        if (userRole === 'ADMIN' && userId === id) {
            req.isAuthToManRole = false;
            next();
        } else if(userRole === 'ADMIN' && userId != id) {
            req.isAuthToManRole = true;
            next(); 
        } else if (userRole === 'ADMIN' && !userId) {
            req.isAuthToManRole = true;
            next();
        } else if (userRole != 'ADMIN' && userId === id) {
            req.isAuthToManRole = false;
            next();
        } else {
            return res.status(401).send({ message: 'Permission denied.' });
        }
    } else {
        req.isAuthToManRole = false;
        next();
    }
};

export default isAuthToManRole;
