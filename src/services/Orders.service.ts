import mongoose from "mongoose";

import { JWTController } from "../controllers/Jwt.controller";
import { User } from "../models/User.model";
import { Order } from "../models/Order.model";
import { Cleaner } from "../models/Cleaner.model";
import { ordersStatusAdminEnum } from "../enums/orderStatusAdmin.enum";
import { ordersStatusUserEnum } from "../enums/orderStatusUser.enum";
import { Service } from "../types/service.type";
import { JwtPayload } from "jsonwebtoken";

export class Orders {
  private jwtController: JWTController;

  constructor() {
    this.jwtController = new JWTController();
  }

  public async createOrder(
    cookie: string,
    cleanerId: string,
    ordered: Array<Service>,
    userCash: string
  ) {
    const { id } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    const userId = new mongoose.Types.ObjectId(id);
    const cleanerIdParsed = new mongoose.Types.ObjectId(cleanerId);
    const user = await User.findOneAndUpdate({ _id: userId }, { cash: Number(userCash) });
    const cleaner = await Cleaner.findOne({ _id: cleanerIdParsed });
    const order = new Order({
      cleaner: cleaner._id,
      user: userId,
      status: 0,
      ordered: ordered,
      cleanerName: cleaner.cleaner,
      userName: `${user.firstName} ${user.middleName} ${user.lastName}`,
    });
    await order.save();
  }

  public async getOrders(cookie: string) {
    const { role, id } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    const response = { orders: undefined, role: role, user: undefined };

    if (role === "Admin") {
      const orders = await Order.find({});
      response.orders = orders.map((element) => {
        const result = Object.assign({}, element._doc);
        result.status = ordersStatusAdminEnum[element.status];
        return result;
      });
    } else {
      const userId = new mongoose.Types.ObjectId(id);
      let orders = await Order.find({ user: userId });

      response.orders = orders.map((element) => {
        const result = Object.assign({}, element._doc);
        result.status = ordersStatusUserEnum[element.status];
        return result;
      });
      const user = await User.findOne({ _id: userId });
      response.user = user;
    }

    return response;
  }

  public async getOrder(cookie: string, orderId: string) {
    const orderIdParsed = new mongoose.Types.ObjectId(orderId);
    const { role, id } = (await this.jwtController.decodeJWTCookie(cookie)) as JwtPayload;
    const response = {
      order: undefined,
      cleaner: undefined,
      user: undefined,
      role: role,
    };

    if (role === "Admin") {
      const order = await Order.findOne({ _id: orderIdParsed });
      response.order = Object.assign({}, order._doc);
      response.order.status = ordersStatusAdminEnum[response.order.status];
      response.order.date = orderIdParsed.getTimestamp().toLocaleString("en-GB");
      const cleaner = await Cleaner.findOne({ _id: response.order.cleaner });
      response.cleaner = cleaner;
    } else {
      const order = await Order.findOne({ _id: orderIdParsed });
      response.order = Object.assign({}, order._doc);
      response.order.status = ordersStatusUserEnum[response.order.status];
      response.order.date = orderIdParsed.getTimestamp().toLocaleString("en-GB");
      response.cleaner = await Cleaner.findOne({ _id: response.order.cleaner });
      const user = await Order.findOne({ _id: id });
      response.user = user;
    }
    return response;
  }

  public async updateOrder(orderId: string, services: Array<Service>, status: string) {
    const orderIdParsed = new mongoose.Types.ObjectId(orderId);
    await Order.updateOne(
      { _id: orderIdParsed },
      {
        ordered: services,
        status: Number(status),
      }
    );
  }

  public async deleteOrder(orderId: string) {
    const orderIdParsed = new mongoose.Types.ObjectId(orderId);
    await Order.deleteOne({ _id: orderIdParsed });
  }
}
