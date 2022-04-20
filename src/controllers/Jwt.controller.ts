import jwt from 'jsonwebtoken';


import { jwtConfig } from '../configs/jwtConfig';

export class JWTController {
  private secret: string;

  constructor() {
    this.secret = jwtConfig.secret;
  }

  public decodeJWTCookie(req) {
    return jwt.verify(req.cookies.jwt, jwtConfig.secret);
  }

  public generateJWTCookie(res, email, role, id) {
    const token = jwt.sign({ email, role, id }, this.secret, { expiresIn: '24h' });
    const cookie = {
      maxAge: 3600 * 1000,
      httpOnly: true,
    };

    res.cookie('jwt', token, cookie);
    res.redirect('/');
  }
}
