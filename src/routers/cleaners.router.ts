import { Router } from 'express';


import { CleanersController } from '../controllers/Cleaners.controller';
import { multerMiddleware } from '../middlewares/Multer.middleware';

export const cleanersRouter = Router();
const cleanerController = new CleanersController();

cleanersRouter
  .route('/')
  .get((req, res) => {
    if (req.cookies.jwt) {
      cleanerController.getCleaners(req, res);
    } else {
      res.redirect('/authentication');
    }
  });

cleanersRouter
  .route('/cleaner/:id')
  .post(multerMiddleware, (req, res) => {
    cleanerController.updateCleaner(req, res);
  })
  .get(async (req, res) => {
    cleanerController.getCleaner(req, res);
  })
  .delete((req, res) => {
    cleanerController.deleteCleaner(req, res);
  });

cleanersRouter
  .route('/cleanerCreation')
  .get((req, res) => {
    cleanerController.getCleaner(req, res);
  })
  .post(multerMiddleware, (req, res) => {
    cleanerController.createCleaner(req, res);
  })
