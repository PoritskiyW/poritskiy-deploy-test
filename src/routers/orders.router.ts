import e, { Router } from "express";

import { OrdersController } from "../controllers/Orders.controller";

export const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.route("/orders").get((req: e.Request, res: e.Response) => {
  ordersController.getOrders(req, res);
});

ordersRouter
  .route("/order/:id")
  .get((req: e.Request, res: e.Response) => {
    ordersController.getOrder(req, res);
  })
  .post((req: e.Request, res: e.Response) => {
    ordersController.updateOrder(req, res);
  })
  .delete((req: e.Request, res: e.Response) => {
    ordersController.deleteOrder(req, res);
  });
