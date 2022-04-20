import { Db, MongoClient } from "mongodb";

import { mongoDBConfig } from "../configs/mongoDB.config";

export class MongoDBController {
  private static instance: MongoDBController;

  private database: Db;

  public async connectToDB() {
    try {
      const connection = await new MongoClient(mongoDBConfig.url).connect();
      this.database = connection.db(mongoDBConfig.dbName);
      return true;
    } catch (err) {
      console.error(err)
      return false;
    }
  }

  public static getInstance() {
    if (!MongoDBController.instance) {
      MongoDBController.instance = new MongoDBController;
    }
    return MongoDBController.instance;
  }

  public async getOne(collection: string, filter: object) {
    try {
      return await this.database.collection(collection).findOne(filter);
    } catch (err) {
      console.error(err);
    }
  }

  public getMany(collection: string, filter: object) {
    try {
      return this.database.collection(collection).find(filter).toArray();
    } catch (err) {
      console.error(err);
    }
  }

  public createOne(collection: string, data: object) {
    try {
      this.database.collection(collection).insertOne(data);
    } catch (err) {
      console.error(err);
    }
  }

  public updateOne(collection: string, filter: object, set: object) {
    try {
      this.database
      .collection(collection)
      .updateOne(
        filter,
        { $set: set });
    } catch (err) {
      console.error(err);
    }
  }

  public async deleteOne(collection: string, filter: object) {
    try {
      this.database.collection(collection).deleteOne(filter)
    } catch (err) {
      console.error(err);
    }
  }
}
