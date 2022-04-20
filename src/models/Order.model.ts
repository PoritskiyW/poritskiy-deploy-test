import { ObjectId } from 'mongodb';
import { MongoDBController } from '../controllers/MongoDB.controller';

export class Order {
  public id: ObjectId;

  public cleaner: ObjectId;

  public cleanerName: string;

  public user: ObjectId;

  public userFullname: string;

  public services: Array<Object>;

  public status: number;

  public returnCause: string;

  private database: MongoDBController;

  constructor(id?: string, cleaner?: string, user?: string, services?: Array<object>) {
    this.id = new ObjectId(id);
    this.database = MongoDBController.getInstance();
    this.cleaner = new ObjectId(cleaner);
    this.user = new ObjectId(user);
    this.services = services;
    this.returnCause = '';
  }

  public createOrder() {
    this.database.createOne('orders', this.getFields());
  }

  public getOrders(id?) {
    if (id) {
      return this.database.getMany('orders', { user: id });
    } else {
      return this.database.getMany('orders', {});
    }
  }

  public async getOrder() {
    const dbResponse = await this.database.getOne('orders', { _id: this.id });
    this.cleaner = dbResponse.cleaner;
    this.services = dbResponse.services;
    this.id = dbResponse._id;
    this.user = dbResponse.user;
    this.cleanerName = dbResponse.cleanerName;
    this.userFullname = dbResponse.userFullname;
    this.returnCause = dbResponse.returnCause;
    this.status = dbResponse.status;
  }

  public async updateOrder() {
    this.database.updateOne('orders', { _id: this.id }, this.getFields());
  }

  public async deleteOrder() {
    this.database.deleteOne('orders', { _id: this.id });
  }

  private getFields() {
    return {
      _id: this.id,
      cleaner: this.cleaner,
      user: this.user,
      services: this.services,
      status: this.status,
      returnCause: this.returnCause,
      userFullname: this.userFullname,
      cleanerName: this.cleanerName
    }
  }
}
