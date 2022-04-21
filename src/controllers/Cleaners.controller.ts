import e from "express";

import { Cleaners } from "../services/Cleaners.service";

export class CleanersController {
  private cleanersService: Cleaners;

  constructor() {
    this.cleanersService = new Cleaners();
  }

  public async createCleaner(req: e.Request, res: e.Response) {
    const { cleanerName, description, services } = req.body;
    const files = Object.values(req.files);
    const servicesParsed = JSON.parse(services);
    this.cleanersService.createCleaner(cleanerName, description, servicesParsed, files);
    res.redirect("/");
  }

  public async updateCleaner(req: e.Request, res: e.Response) {
    const cookie = req.cookies.jwt;
    const id = req.params.id;
    const { cleanerName, description, services, images } = req.body;
    const files = Object.values(req.files);
    const servicesParsed = JSON.parse(services);
    const imagesParser = JSON.parse(images);
    this.cleanersService.updateCleaner(
      id,
      imagesParser,
      files,
      cleanerName,
      description,
      servicesParsed
    );
    res.redirect("/");
  }

  public async deleteCleaner(req: e.Request, res: e.Response) {
    const id = req.params.id;
    this.cleanersService.deleteCleaner(id);
    res.redirect("/");
  }

  public async getCleaners(req: e.Request, res: e.Response) {
    const cookie = req.cookies.jwt;
    const response = await this.cleanersService.getCleaners(cookie);
    res.render("cleanersListLayout", response);
  }

  public async getCleaner(req: e.Request, res: e.Response) {
    const id = req.params.id;
    const cookie = req.cookies.jwt;
    const response = await this.cleanersService.getCleaner(cookie, req.params.id);
    res.render("cleanerLayout", response);
  }
}
