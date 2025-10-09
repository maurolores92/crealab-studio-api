import { Router } from 'express';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { wordpressController } from './wordpress.controller';

class WordpressRouter {
    public basePath = '/wordpress';
    public router: Router;

    constructor() {
        this.router = Router();
        this.prepareRouters();
        this.initRoutes([apiTokenValidation, Context.create]);
    }

    private prepareRouters = () => {
    this.router.get('/products', wordpressController.getProducts);
    this.router.get('/products', wordpressController.getProducts);
    this.router.post('/product-categories', wordpressController.createProductCategory);
    };

    private initRoutes(middleware: any[]) {
        this.router.use(...middleware);
    }
}

export const wordpressRouter = new WordpressRouter();
