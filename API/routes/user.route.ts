import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getUserById);
userRouter.post('/', userController.addNewUser);
userRouter.put('/:id', userController.updateExistingUser);
userRouter.delete('/:id', userController.deleteUserById);

export default userRouter;