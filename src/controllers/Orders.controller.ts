import { ObjectId } from 'mongodb';

import { Order } from '../models/Order.model';
import { JWTController } from './Jwt.controller';
import { User } from '../models/User.model';
import { Cleaner } from '../models/Cleaner.model';
import { ordersStatusEnum } from '../enums/orderStatus.enum';

export class OrdersController {
  private jwtController: JWTController;

  constructor() {
    this.jwtController = new JWTController;
  }

  public async createOrder(req, res) {
    if (req.cookies.jwt) {
      const userId = this.jwtController.decodeJWTCookie(req).id;
      const user = new User();

      user.id = new ObjectId(userId);
      await user.getUser();
      user.cash = req.body.userCash;
      user.updateUser();

      const cleaner = new Cleaner();
      cleaner._id = new ObjectId(req.params.id);
      await cleaner.getCleaner();
      const order = new Order();
      order.cleaner = new ObjectId(req.params.id);
      order.cleanerName = cleaner.cleaner;

      order.userFullname = `${user.firstName} ${user.middleName} ${user.lastName}`;
      order.user = new ObjectId(userId);
      order.services = req.body.ordered;
      order.status = 0;
      order.createOrder();
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  }

  public async getOrders(req, res) {
    if (req.cookies.jwt) {
      const { email, role } = this.jwtController.decodeJWTCookie(req);

      if (role === 'Admin') {
        const orders = await new Order().getOrders();
        orders.forEach(element => {
          element.status = ordersStatusEnum[Number(element.status)].admin;
        });
        res.render('ordersListLayout', { orders: orders });
      } else {
        const user = new User(email);
        await user.getUser();
        const orders = await new Order().getOrders(user.id);
        orders.forEach(element => {
          element.status = ordersStatusEnum[Number(element.status)].user;
        });
        res.render('ordersListLayout', { orders: orders, user: user });
      }
    } else {
      res.redirect('/');
    }
  }

  public async getOrder(req, res) {
    if (req.cookies.jwt) {
      const orderId = req.params.id;

      const { role, email } = this.jwtController.decodeJWTCookie(req);
      const order = new Order();
      order.id = new ObjectId(orderId);
      await order.getOrder();

      if (role === 'Admin') {
        const user = new User();
        user.id = order.user;
        await user.getUser();

        const cleaner = new Cleaner();
        cleaner._id = new ObjectId(order.cleaner);
        await cleaner.getCleaner();
        Object.assign(order, {
          fullname: `${user.firstName} ${user.middleName} ${user.lastName}`,
          date: new ObjectId(orderId).getTimestamp().toLocaleString('en-GB'),
          cleaner: cleaner,
          status: ordersStatusEnum[order.status].admin
        });
        res.render('orderLayout', { order: order, role: role });
      } else {
        const user = new User(email);
        await user.getUser();
        Object.assign(order, {
          status: ordersStatusEnum[order.status].user
        })
        res.render('orderLayout', { order: order, role: role, user: user });
      }
    } else {
      res.redirect('/');
    }
  }

  public async updateOrder(req, res) {
    const orderId = req.params.id;
    console.log(orderId);

    const order = new Order();
    order.id = new ObjectId(orderId);
    await order.getOrder();
    console.log(order);

    order.services = req.body.services;
    order.status = Number(req.body.status);
    console.log(order.status);

    order.updateOrder();
    res.redirect('/orders');
  }

  public deleteOrder(req, res) {
    const order = new Order(req.params.id);
    order.deleteOrder();
    res.redirect('/orders');
  }
}
