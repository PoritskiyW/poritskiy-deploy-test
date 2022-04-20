import { MongoDBController } from "../controllers/MongoDB.controller";
import { ObjectId } from 'mongodb';

export class User {
  public id: ObjectId;

  public email: string;

  public password: string;

  public role: string;

  public cash: number;

  public firstName: string;

  public middleName: string;

  public lastName: string;

  private database: MongoDBController;

  constructor(email?: string, password?: string, role?: string,
     fname?: string, mname?: string, lname?: string, cash?: string) {

    this.database = MongoDBController.getInstance();
    this.email = email;
    this.password = password;
    this.role = role;
    if (cash) {
      this.cash = Number(cash);
    }
    if (fname && mname && lname) {
      this.firstName = fname;
      this.middleName = mname;
      this.lastName = lname;
    } else {
      this.firstName = '';
      this.middleName = '';
      this.lastName = '';
    }
  }

  public async getUser() {
    let dbResponse;
    if (this.email) {
      dbResponse = await this.database.getOne('users', { email: this.email });
    } else {
      dbResponse = await this.database.getOne('users', { _id: this.id });
    }

    if (dbResponse) {
      this.id = new ObjectId(dbResponse._id);
      this.email = dbResponse.email;
      this.password = dbResponse.password;
      this.role = dbResponse.role;
      if (this.role !== 'Admin') {
        this.cash = dbResponse.cash;
        if(dbResponse.firstName && dbResponse.middleName && dbResponse.lastName) {
          this.firstName = dbResponse.firstName;
          this.middleName = dbResponse.middleName;
          this.lastName = dbResponse.lastName;
        }
      }
      return true;
    }
    return false;
  }

  public createUser() {
    let data = {};
    if (this.role === 'Admin') {
      data = {
        email: this.email,
        password: this.password,
        role: this.role
       };
    } else {
      data = {
        email: this.email,
        password: this.password,
        role: this.role,
        cash: this.cash
       };
    }

    this.database.createOne('users', data);
  }

  public async updateUser() {
    this.database.updateOne('users', { email: this.email }, this.getFields());
  }

  private getFields() {
    return {
      email: this.email,
      password: this.password,
      role: this.role,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      cash: this.cash
    }
  }
}
