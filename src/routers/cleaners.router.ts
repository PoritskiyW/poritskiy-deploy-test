import e, { Router } from "express";
import { JwtPayload } from "jsonwebtoken";

import { CleanersController } from "../controllers/Cleaners.controller";
import { multerMiddleware } from "../middlewares/multer.middleware";
import { JWTController } from "../controllers/Jwt.controller";
import { OrdersController } from "../controllers/Orders.controller";

export const cleanersRouter = Router();
const cleanerController = new CleanersController();
const orderController = new OrdersController();
const jwt = new JWTController();

cleanersRouter.route("/").get((req: e.Request, res: e.Response) => {
  if (req.cookies.jwt) {
    cleanerController.getCleaners(req, res);
  } else {
    res.redirect("/authentication");
  }
});

cleanersRouter
  .route("/cleaner/:id")
  .post(multerMiddleware, (req: e.Request, res: e.Response) => {
    const { role } = jwt.decodeJWTCookie(req.cookies.jwt) as JwtPayload;
    if (role === "Admin") {
      cleanerController.updateCleaner(req, res);
    } else {
      orderController.createOrder(req, res);
    }
  })
  .get(async (req: e.Request, res: e.Response) => {
    cleanerController.getCleaner(req, res);
  })
  .delete((req: e.Request, res: e.Response) => {
    cleanerController.deleteCleaner(req, res);
  });

cleanersRouter
  .route("/cleanerCreation")
  .get((req: e.Request, res: e.Response) => {
    cleanerController.getCleaner(req, res);
  })
  .post(multerMiddleware, (req: e.Request, res: e.Response) => {
    cleanerController.createCleaner(req, res);
  });
