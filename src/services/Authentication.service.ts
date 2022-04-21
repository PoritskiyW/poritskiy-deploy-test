import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { EmailController } from "../controllers/Email.controller";
import { JWTController } from "../controllers/Jwt.controller";
import { User } from "../models/User.model";
import { JwtPayload } from "jsonwebtoken";

export class Authentication {
  private jwtController: JWTController;

  private emailController: EmailController;

  constructor() {
    this.emailController = new EmailController();
    this.jwtController = new JWTController();
  }

  public async register(email: string, password: string, role: string) {
    const user = await User.findOne({ email: email }).exec();
    const response = { cookie: null, token: null, errorMessage: null };

    if (!user) {
      const hashPassword = await bcrypt.hash(password, 7);

      if (role !== "Admin") {
        const cash = Authentication.generateCash();
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          password: hashPassword,
          role: role,
          cash: cash,
        });
        const inserted = await newUser.save();
        const { cookie, token } = this.jwtController.generateJWTCookie(email, role, inserted._id);
        response.cookie = cookie;
        response.token = token;
      } else {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          password: hashPassword,
          role: role,
        });
        const inserted = await newUser.save();
        const { cookie, token } = this.jwtController.generateJWTCookie(email, role, inserted._id);
        response.cookie = cookie;
        response.token = token;
      }
    } else {
      response.errorMessage = "Аккаунт уже существует";
    }

    return response;
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ email: email }).exec();
    const response = { cookie: null, token: null, errorMessage: null };

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const { cookie, token } = this.jwtController.generateJWTCookie(email, user.role, user._id);
        response.cookie = cookie;
        response.token = token;
      } else {
        response.errorMessage = "Не верный пароль";
      }
    } else {
      response.errorMessage = "Аккаунта с такой почтой не существует";
    }

    return response;
  }

  public async restorePassword(email: string) {
    const response = { errorMessage: null };
    const user = await User.findOne({ email: email }).exec();

    if (user) {
      const newPassword = await bcrypt.hash(Authentication.generateNewPassword(), 7);
      await User.updateOne({ email: email }, { password: newPassword });
      this.emailController.sendEmail(newPassword, email);
    } else {
      response.errorMessage = "Аккаунта с такой почтой не существует";
    }

    return response;
  }

  public async getUserData(cookie: string) {
    const { email } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    const user = await User.findOne({ email: email });

    return user;
  }

  public async updateUserData(
    cookie: string,
    firstName: string,
    middleName: string,
    lastName: string
  ) {
    const { email } = this.jwtController.decodeJWTCookie(cookie) as JwtPayload;
    await User.updateOne(
      { email: email },
      { firstName: firstName, middleName: middleName, lastName: lastName }
    );
  }

  static generateCash() {
    return Math.floor(200 + Math.random() * (500 + 1 - 200));
  }

  static generateNewPassword() {
    let result = "";
    const symbolsPool = "abcdefghijklmnopqrstuvwxyz1234567890";

    while (result.length <= 16) {
      const poolSymbolIndex = Math.floor(Math.random() * symbolsPool.length);
      result += symbolsPool.charAt(poolSymbolIndex);
    }
    return result;
  }
}
