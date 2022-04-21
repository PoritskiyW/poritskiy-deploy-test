import e, { Router } from "express";

import { AuthenticationController } from "../controllers/Authentication.controller";

export const authenticationRouter = Router();
const authController = new AuthenticationController();

authenticationRouter
  .route("/authentication")
  .get((req: e.Request, res: e.Response) => {
    res.render("authentication");
  })
  .post(async (req: e.Request, res: e.Response) => {
    authController.login(req, res);
  });

authenticationRouter
  .route("/registration")
  .get((req: e.Request, res: e.Response) => {
    res.render("registration");
  })
  .post((req: e.Request, res: e.Response) => {
    authController.registration(req, res);
  });

authenticationRouter
  .route("/restore")
  .get((req: e.Request, res: e.Response) => {
    res.render("passwordRestoration");
  })
  .post((req: e.Request, res: e.Response) => {
    authController.restorePassword(req, res);
  });

authenticationRouter
  .route("/user/:id")
  .get((req: e.Request, res: e.Response) => {
    authController.getPersonalData(req, res);
  })
  .post((req: e.Request, res: e.Response) => {
    authController.updatePersonalData(req, res);
  });
