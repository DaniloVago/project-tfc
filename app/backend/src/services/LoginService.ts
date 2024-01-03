import * as bcrypt from 'bcryptjs';
import jwtUtils from '../utils/jwtUtils';
import { ServiceResponse } from '../Interfaces/service/IService';
import { User } from '../types/User';
import UsersModel from '../database/models/UsersModel';

export default class LoginService {
  constructor(
    private loginModel = UsersModel,
  ) { }

  public async login(email: string, password: string): Promise<ServiceResponse<User | string>> {
    // procurando user no banco
    const user = await this.loginModel.findOne({ where: { email } });
    if (!user) {
      return { status: 401, data: { message: 'Invalid email or password' } };
    }
    // comparando a compatibilidade das senhas
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: 401, data: { message: 'Invalid email or password' } };
    }
    // gerar token
    const token = jwtUtils.sign(email);

    return { status: 200, data: { token } };
  }

  public async getRole(email: string): Promise<ServiceResponse<User | string>> {
    const user = await this.loginModel.findOne({ where: { email } });
    if (!user) {
      return { status: 404, data: { message: 'User not found' } };
    }
    const { role } = user;
    return { status: 200, data: { role } };
  }
}
