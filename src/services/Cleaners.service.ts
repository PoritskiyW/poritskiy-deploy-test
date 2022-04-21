import mongoose from "mongoose";

import { JWTController } from "../controllers/Jwt.controller";
import { FileSystemController } from "../controllers/FileSystem.controller";
import { User } from "../models/User.model";
import { Cleaner } from "../models/Cleaner.model";
import { Service } from "../types/service.type";
import { JwtPayload } from "jsonwebtoken";

export class Cleaners {
  private jwtController: JWTController;

  private fsController: FileSystemController;

  constructor() {
    this.jwtController = new JWTController();
    this.fsController = new FileSystemController();
  }

  public async createCleaner(
    cleanerName: string,
    description: string,
    services: Array<Service>,
    files: Array<Express.Multer.File>
  ) {
    const cleanerId = new mongoose.Types.ObjectId();
    let images: Array<string> = [];

    if (files.length !== 0) {
      images = await this.fsController.moveImages(files, cleanerId.toString(), false);
    }
    const cleaner = new Cleaner({
      _id: cleanerId,
      cleaner: cleanerName,
      description: description,
      services: services,
      images: images,
    });
    await cleaner.save();
  }

  public async updateCleaner(
    id: string,
    images: Array<string>,
    files: Array<Express.Multer.File>,
    cleanerName: string,
    description: string,
    services: Array<Service>
  ) {
    await this.fsController.cleanImages(images, id.toString());
    let newImages: Array<string> = [];
    if (files.length !== 0) {
      newImages = await this.fsController.moveImages(files, id, true);
    }
    const resultImages = images.concat(newImages);
    const cleanerId = new mongoose.Types.ObjectId(id);

    await Cleaner.updateOne(
      { _id: cleanerId },
      {
        cleaner: cleanerName,
        description: description,
        services: services,
        images: resultImages,
      }
    );
  }

  public async deleteCleaner(id: string) {
    const cleanerId = new mongoose.Types.ObjectId(id);
    this.fsController.deleteFolder(id);
    await Cleaner.deleteOne({ _id: cleanerId });
  }

  public async getCleaner(cookie: string, id?: string) {
    const { role, email } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    const response = { role: role, cleaner: undefined, user: undefined };

    if (id) {
      const cleanerId = new mongoose.Types.ObjectId(id);
      const cleaner = await Cleaner.findOne({ _id: cleanerId });
      response.cleaner = cleaner;

      if (role !== "Admin") {
        const user = await User.findOne({ email: email });
        response.user = user;
      }
    }

    return response;
  }

  public async getCleaners(cookie: string) {
    const { role, id } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    const response = { role: role, cleaners: undefined, user: undefined };

    if (role === "Admin") {
      response.cleaners = await Cleaner.find({});
    } else {
      const userId = new mongoose.Types.ObjectId(id);
      const cleaners = await Cleaner.find({ user: userId });
      response.cleaners = cleaners;
      const user = await User.findOne({ _id: userId });
      response.user = user;
    }

    return response;
  }
}
