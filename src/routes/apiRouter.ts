import { Router } from 'express';
import { authRouter } from '@src/modules/auth/auth.router';
import { userRouter } from '@src/modules/users/users.router';
import seedersRouter from '@src/modules/seeders/seeders.router';
import { productsRouter } from '@src/modules/products/products.router';
import { clientsRouter } from '@src/modules/clients/client.router';
import orderRouter from '@src/modules/orders/order.router';
import searchRouter from '@src/modules/search/search.router';
import { inventoryRouter } from '@src/modules/inventory/inventory.router';
import { expensesRouter } from '@src/modules/expenses/expenses.router';
import { dashboardsRouter } from '@src/modules/dashboards/dashboards.router';
import { withdrawalRouter } from '@src/modules/withdrawal/withdrawal.router';
import { wordpressRouter } from '@src/modules/wordpress/wordpress.router';

const routes = [
  seedersRouter,
  authRouter,
  userRouter,
  productsRouter,
  clientsRouter,
  orderRouter,
  searchRouter,
  inventoryRouter,
  expensesRouter,
  dashboardsRouter,
  withdrawalRouter,
  wordpressRouter
];

const router = Router();

routes.forEach((route) => router.use(route.basePath, route.router));

export default router;
