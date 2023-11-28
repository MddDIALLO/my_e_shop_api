import { Request, Response, NextFunction } from 'express';

const isAuthToManRole = (req: Request, res: Response, next: NextFunction) => {
    const userRole: number = req.user?.role_id;
    const id: number = req.user?.id;
    const userId: number = Number(req.params?.id);

    if(req.isAuth) {
        if (userRole === 1 && userId === id) {
            req.isAuthToManRole = false;
            next();
        } else if(userRole === 1 && userId != id) {
            req.isAuthToManRole = true;
            next(); 
        } else if (userRole === 1 && !userId) {
            req.isAuthToManRole = true;
            next();
        } else if (userRole != 1 && userId === id) {
            req.isAuthToManRole = true;
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
