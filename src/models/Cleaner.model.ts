import { ObjectId } from "mongodb";
import { MongoDBController } from "../controllers/MongoDB.controller";

export class Cleaner {
  public _id: ObjectId;

  public cleaner: string;

  public description: string;

  public services: Array<Object>;

  public images:  Array<string>;

  private database: MongoDBController;

  constructor(cleaner?: string, description?: string, services?: Array<object>, images?:Array<string>) {
    this.database = MongoDBController.getInstance();
    this.cleaner = cleaner;
    this.description = description;
    this.services = services;
    if (images) {
      this.images = images;
    }
  }

  public createCleaner() {
    this.database.createOne('cleaners', this.getFields());
  }

  public updateCleaner() {
    this.database.updateOne('cleaners', { _id: this._id }, this.getFields());
  }

  public deleteCleaner() {
    this.database.deleteOne('cleaners', { _id: this._id });
  }

  public getCleaners(filter?: object) {
    if (filter) {
      return this.database.getMany('cleaners', filter);
    } else {
      return this.database.getMany('cleaners', {});
    }
  }

  public async getCleaner() {
    const dbResponce = await this.database.getOne('cleaners', { _id: this._id });

    if (dbResponce) {
      this.cleaner = dbResponce.cleaner;
      this.description = dbResponce.description;
      this.services = JSON.parse(dbResponce.services);
      if (dbResponce.images) {
        this.images = dbResponce.images;
      }
      return true;
    } else {
      return false;
    }
  }

  private getFields() {
    return {
      _id: this._id,
      cleaner: this.cleaner,
      description: this.description,
      services: this.services,
      images: this.images
    }
  }
}
