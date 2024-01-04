import { Router } from 'express';
import imageController  from '../controllers/image.controller'

const imageRouter = Router();

imageRouter.post('/', imageController.storeImage);

export default imageRouter;