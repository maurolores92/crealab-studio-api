import { Router } from 'express';
import { categoryController } from './category.controller';

const router = Router();

router.get('/', categoryController.all);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export const categoryRouter = {
	basePath: '/categories',
	router
};
