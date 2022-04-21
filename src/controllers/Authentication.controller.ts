import e from "express";

import { Authentication } from "../services/Authentication.service";

export class AuthenticationController {
  private authService: Authentication;

  constructor() {
    this.authService = new Authentication();
  }

  public async registration(req: e.Request, res: e.Response) {
    const { email, password, role } = req.body;
    const { cookie, token, errorMessage } = await this.authService.register(email, password, role);

    if (errorMessage) {
      res.render("registration", { errorMessage: errorMessage });
    } else {
      res.cookie("jwt", token, cookie);
      res.redirect("/");
    }
  }

  public async login(req: e.Request, res: e.Response) {
    const { email, password } = req.body;
    const { cookie, token, errorMessage } = await this.authService.login(email, password);

    if (errorMessage) {
      res.render("authentication", { errorMessage: errorMessage });
    } else {
      res.cookie("jwt", token, cookie);
      res.redirect("/");
    }
  }

  public async restorePassword(req: e.Request, res: e.Response) {
    const { email } = req.body;
    const { errorMessage } = await this.authService.restorePassword(email);

    if (errorMessage) {
      res.render("passwordRestoration", { errorMessage: errorMessage });
    } else {
      res.redirect("/authentication");
    }
  }

  public async getPersonalData(req: e.Request, res: e.Response) {
    const user = await this.authService.getUserData(req.cookies.jwt);
    res.render("userUpdate", { user: user });
  }

  public async updatePersonalData(req: e.Request, res: e.Response) {
    const { firstName, middleName, lastName } = req.body;
    const cookie = req.cookies.jwt;
    this.authService.updateUserData(cookie, firstName, middleName, lastName);
    res.redirect("/");
  }
}
