import { ObjectId } from 'mongodb';


import { Cleaner } from '../models/Cleaner.model';
import { JWTController } from './Jwt.controller';
import { User } from '../models/User.model';
import { FileSystemController } from './FileSystem.controller';
import { OrdersController } from './Orders.controller';

export class CleanersController {
  private jwtController: JWTController;

  private fileSystemController: FileSystemController;

  private ordersController: OrdersController;

  constructor() {
    this.jwtController = new JWTController;
    this.fileSystemController = new FileSystemController;
    this.ordersController = new OrdersController;
  }

  public async createCleaner(req, res) {
    const { cleanerName, description, services } = req.body;
    const cleaner = new Cleaner(cleanerName, description, services);
    const id = new ObjectId();
    cleaner._id = id;
    const images = await this.fileSystemController.moveImages(req.files, id.toString(), false);
    cleaner.images = images;
    cleaner.createCleaner();
    res.redirect('/');
  }

  public async updateCleaner(req, res) {
    if (req.cookies.jwt) {
      const { role, email } = this.jwtController.decodeJWTCookie(req);

      if (role === 'Admin') {
        const id = new ObjectId(req.params.id);
        const set = req.body;
        this.fileSystemController.cleanImages(JSON.parse(set.images), id.toString());
        const images = await this.fileSystemController.moveImages(req.files, id.toString(), true);
        set.images = JSON.parse(set.images).concat(images);

        const cleaner = new Cleaner();
        cleaner._id = id;
        cleaner.cleaner = set.cleanerName;
        cleaner.description = set.description;
        cleaner.services = set.services;
        cleaner.images = set.images;
        cleaner.updateCleaner();
        res.redirect('/');
      } else {
        this.ordersController.createOrder(req, res);
      }
    }
  }

  public async deleteCleaner(req, res) {
    const cleaner = new Cleaner();
    const id = new ObjectId(req.params.id);
    cleaner._id = id;
    this.fileSystemController.deleteFolder(req.params.id);
    cleaner.deleteCleaner();
    res.redirect('/');
  }

  public async getCleaners(req, res) {
    if (req.cookies.jwt) {
      const { role, email } = this.jwtController.decodeJWTCookie(req);
      const cleaner = new Cleaner();
      const cleaners = await cleaner.getCleaners();
      if (role === 'Admin') {
        res.render('cleanersListLayout', {
          role: role,
          cleaners: cleaners
        })
      } else {
        const user = new User(email);
        await user.getUser();
        res.render('cleanersListLayout', {
          role: role,
          cleaners: cleaners,
          user: user
        })
      }
    } else {
      res.redirect('/');
    }

  }

  public async getCleaner(req, res) {
    if(req.cookies.jwt) {
      const { role, email } = this.jwtController.decodeJWTCookie(req);
      const cleaner = new Cleaner();

      if (req.params.id) {
        cleaner._id = new ObjectId(req.params.id);
        await cleaner.getCleaner();

        if (role !== 'Admin') {
          const user = new User(email);
          await user.getUser();
          res.render('cleanerLayout', {
            cleaner: cleaner,
            role: role,
            user: user
          });
        } else {
          res.render('cleanerLayout', {
            cleaner: cleaner,
            role: role
          });
        }
      } else {
        if (role === 'Admin') {
          res.render('cleanerLayout', { role: role });
        } else {
          res.redirect('/');
        }
      }
    } else {
      res.redirect('/');
    }
  }
}
