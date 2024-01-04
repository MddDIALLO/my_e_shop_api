import { Router } from 'express';
import userController from '../controllers/user.controller';
import authenticateToken from '../middleware/auth';
import isAdmin from '../middleware/admin';
import isAuth from '../middleware/userAdmin';
import isAuthToManRole from '../middleware/userRoleMan';

const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);
userRouter.get('/', authenticateToken, isAdmin, userController.getAll);
userRouter.get('/:id', authenticateToken, isAuth, userController.getUserById);
userRouter.post('/', isAuthToManRole, userController.addNewUser);
userRouter.put('/:id', authenticateToken, isAuth, isAuthToManRole, userController.updateExistingUser);
userRouter.delete('/:id', authenticateToken, isAuth, userController.deleteUserById);

export default userRouter;