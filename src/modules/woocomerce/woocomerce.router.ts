import { Router } from 'express';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { woocommerceController } from './woocomerce.controller';

class WoocommerceRouter {
    public basePath = '/woocomerce';
    public router: Router;

    constructor() {
        this.router = Router();
        this.prepareRouters();
        this.initRoutes([apiTokenValidation, Context.create]);
    }

    private prepareRouters = () => {
        this.router.post('/sync-all', woocommerceController.syncAllProducts);
    };

    private initRoutes(middleware: any[]) {
        this.router.use(...middleware);
    }
}

export const woocommerceRouter = new WoocommerceRouter();
