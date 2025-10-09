import { Router } from 'express';
import { productsController } from './products.controller';
import { categoryRouter } from './categories/category.router';


const router = Router();
router.use(categoryRouter.basePath, categoryRouter.router);
router.get('/', productsController.getAllFromWordpress);
router.post('/', productsController.createWpProduct);
router.get('/:id', productsController.getWpProductById);
router.put('/:id', productsController.updateWpProduct);
router.delete('/:id', productsController.deleteFromWordpress);
router.post('/:id/image', productsController.uploadProductImage);
router.post('/:id/gallery-image', productsController.uploadProductGalleryImage);

export const productsRouter = {
	basePath: '/products',
	router
};
