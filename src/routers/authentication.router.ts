import { Router } from 'express';


import { AuthenticationController } from '../controllers/Authentication.controller';

export const authenticationRouter = Router();
const authController = new AuthenticationController;

authenticationRouter
  .route('/authentication')
  .get((req, res) => {
    res.render('authentication');
  })
  .post(async (req, res) => {
    authController.login(req, res);
  });

authenticationRouter
  .route('/registration')
  .get((req, res) => {
    res.render('registration');
  })
  .post((req, res) => {
    authController.registration(req, res);
  })

authenticationRouter
  .route('/restore')
  .get((req, res) => {
    res.render('passwordRestoration');
  })
  .post((req, res) => {
    authController.restorePassword(req, res);
  })

authenticationRouter
  .route('/user/:id')
  .get((req, res) => {
    authController.getPersonalData(req, res);
  })
  .post((req, res) => {
    authController.updatePersonalData(req, res);
  })
