import jwt, { JwtPayload } from "jsonwebtoken";

import { jwtConfig } from "../configs/jwtConfig";
import { cookie } from "../types/cookie.type";

export class JWTController {
  private secret: string;

  constructor() {
    this.secret = jwtConfig.secret;
  }

  public decodeJWTCookie(cookie: string): string | JwtPayload {
    return jwt.verify(cookie, jwtConfig.secret);
  }

  public generateJWTCookie(
    email: string,
    role: string,
    id: string
  ): { token: string; cookie: cookie } {
    const token = jwt.sign({ email, role, id }, this.secret, { expiresIn: "24h" });
    const cookie = {
      maxAge: 3600 * 1000,
      httpOnly: true,
    };
    return {
      token: token,
      cookie: cookie,
    };
  }
}
