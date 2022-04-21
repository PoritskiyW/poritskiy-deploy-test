import e from "express";

import { Orders } from "../services/Orders.service";

export class OrdersController {
  private ordersService: Orders;

  constructor() {
    this.ordersService = new Orders();
  }

  public async createOrder(req: e.Request, res: e.Response) {
    const cookie = req.cookies.jwt;
    const cleanerId = req.params.id;
    const ordered = req.body.ordered;
    const cash = req.body.userCash;
    await this.ordersService.createOrder(cookie, cleanerId, ordered, cash);
    res.redirect("/orders");
  }

  public async getOrders(req: e.Request, res: e.Response) {
    const cookie = req.cookies.jwt;
    const data = await this.ordersService.getOrders(cookie);
    res.render("ordersListLayout", data);
  }

  public async getOrder(req: e.Request, res: e.Response) {
    const cookie = req.cookies.jwt;
    const orderId = req.params.id;
    const response = await this.ordersService.getOrder(cookie, orderId);
    res.render("orderLayout", response);
  }

  public updateOrder(req: e.Request, res: e.Response) {
    const orderId = req.params.id;
    const services = req.body.ordered;
    const status = req.body.status;
    this.ordersService.updateOrder(orderId, services, status);
    res.redirect("/orders");
  }

  public deleteOrder(req: e.Request, res: e.Response) {
    const orderId = req.params.id;
    this.ordersService.deleteOrder(orderId);
    res.redirect("/orders");
  }
}
