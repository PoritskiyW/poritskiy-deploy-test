import bcrypt from 'bcrypt';

import { User } from '../models/User.model';
import { EmailController } from './Email.controller';
import { JWTController } from './Jwt.controller';

export class AuthenticationController {

  private emailController: EmailController;

  private jwtController: JWTController;

  constructor() {
    this.emailController = new EmailController;
    this.jwtController = new JWTController;
  }

  public async registration(req, res) {

    const { email, password, role } = req.body;
    const user = new User(email);
    const check = await new User(email).getUser();

    const hashPassword = await bcrypt.hash(password, 7);

    if (check) {
      res.render('registration', { errorMessage: 'Аккаунт уже существует' });
    } else {
      user.password = hashPassword;
      user.role = role;
      if (role !== 'Admin') {
        user.cash = AuthenticationController.generateCash();
      }
      console.log('user', user);

      user.createUser();
      this.jwtController.generateJWTCookie(res, user.email, user.role, user.id);
    }
  }

  public async login(req, res) {
    const { email, password } = req.body;
    const user = new User(email);
    const check = await user.getUser();

    if (check) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        this.jwtController.generateJWTCookie(res, email, user.role, user.id);
      } else {
        res.render('authentication', { errorMessage: 'Не верный пароль' });
      }
    } else {
      res.render('authentication', { errorMessage: 'Аккаунта с такой почтой не существует' });
    }
  }

  public async restorePassword(req, res) {
    const { email } = req.body;
    const user = new User(email);
    const check = await user.getUser();

    if (check) {
      const newPassword = AuthenticationController.generateNewPassword();
      user.password = await bcrypt.hash(newPassword, 7);
      user.updateUser();

      this.emailController.sendEmail(newPassword, email);
      res.redirect('/authentication');
    } else {
      res.render('authentication', { errorMessage: 'Аккаунта с такой почтой не существует' });
    }
  }

  public async getPersonalData(req, res) {
    const { email } = this.jwtController.decodeJWTCookie(req);
    const user = new User(email);
    await user.getUser();
    res.render('userUpdate', {
      user: user
    });
  }

  public async updatePersonalData(req, res) {
    const { firstName, middleName, lastName } = req.body;
    const { email } = this.jwtController.decodeJWTCookie(req);
    const user = new User(email);
    await user.getUser();
    user.firstName = firstName;
    user.middleName = middleName;
    user.lastName = lastName;
    user.updateUser();
    res.redirect('/');
  }

  static generateCash() {
    return Math.floor(200 + Math.random() * (500 + 1 - 200));
  }

  static generateNewPassword() {
    let result = "";
    const symbolsPool = 'abcdefghijklmnopqrstuvwxyz1234567890'

    while(result.length <= 16) {
      const poolSymbolIndex = Math.floor(Math.random() * symbolsPool.length);
      result += symbolsPool.charAt(poolSymbolIndex);
    }
    return result;
  }
}
