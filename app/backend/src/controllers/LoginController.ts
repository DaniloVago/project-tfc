import { Request, Response } from 'express';
import LoginService from '../services/LoginService';
import jwtUtils from '../utils/jwtUtils';

export default class LoginController {
  constructor(
    private loginService = new LoginService(),
  ) { }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.loginService.login(email, password);
    const { status, data } = result;
    return res.status(status).json(data);
  }

  async getRole(req: Request, res: Response) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    const token = authorization.split(' ')[1];
    const decodedToken = jwtUtils.verify(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    const { email } = decodedToken;
    const result = await this.loginService.getRole(email);
    const { status, data } = result;
    return res.status(status).json(data);
  }
}
