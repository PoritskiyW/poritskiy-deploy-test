import { Router } from 'express';


import { OrdersController } from '../controllers/Orders.controller';

export const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter
  .route('/orders')
  .get((req, res) => {
    ordersController.getOrders(req, res);
  })

ordersRouter
  .route('/order/:id')
  .get((req, res) => {
    ordersController.getOrder(req, res);
  })
  .post((req, res) => {
    ordersController.updateOrder(req, res);
  })
  .delete((req, res) => {
    ordersController.deleteOrder(req, res);
  })
