import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { App } from '../app';
const { app } = new App();
import { loginEnter, loginReturn, loginWrongEnter, loginWrongReturn } from './mocks/login.mock';
import LoginService from '../services/LoginService';
import jwtUtils from '../utils/jwtUtils';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testes do endpoint /login', () => {
  beforeEach(async () => { sinon.restore() } );
  const prefix = '/login';
  it('Deve retornar login sucesso com email e senha validos e retornar um token', async () => {
    // cria um stub para login de LoginService
    const loginServiceStub = sinon.stub();
    loginServiceStub.withArgs(loginEnter.email, loginEnter.password).resolves({ status: 200, data: loginReturn });

    // substitui a implementação original pelo stub
    const loginServiceInstance = new LoginService();
    loginServiceInstance.login = loginServiceStub;

    // faz um POST para a rota /login com o payload de loginEnter
    const response = await chai.request(app)
      .post(prefix)
      .send(loginEnter);

    // verifica se a response está correta
    expect(response).to.have.status(200);
    expect(response.body).to.be.equal(loginReturn.token);
  });

  it('Deve retornar login inválido e status 401 quando o email ou senha estão incorretos', async () => {
    const loginServiceStub = sinon.stub();
    loginServiceStub.withArgs(loginWrongEnter.email, loginWrongEnter.password).resolves({ status: 401, data: loginWrongReturn });

    const loginServiceInstance = new LoginService();
    loginServiceInstance.login = loginServiceStub;

    const response = await chai.request(app)
      .post(prefix)
      .send(loginWrongEnter);

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal(loginWrongReturn);
  });

describe('Testes do endpoint /login/role', () => {
  beforeEach(() => {
    sinon.restore();
  });

  const { app } = new App();
  const prefix = '/login/role';

  it('Deve retornar o papel do usuário com token válido', async () => {
    const token = 'validToken';
    const decodedToken = { email: 'test@example.com', role: 'admin' };
    const jwtUtilsStub = sinon.stub(jwtUtils, 'verify').returns(decodedToken);

    // Criando um stub para LoginService.getRole
    const loginServiceStub = sinon.stub();
    loginServiceStub.withArgs(decodedToken.email).resolves({ status: 200, data: { role: 'admin' } });

    const loginServiceInstance = new LoginService();
    loginServiceInstance.getRole = loginServiceStub;

    const response = await chai.request(app)
      .get(prefix)
      .set('Authorization', `Bearer ${token}`);

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ role: 'admin' });
    expect(jwtUtilsStub.calledOnce).to.be.true; // Verifica se jwtUtils.verify foi chamada
  });

  it('Deve retornar erro de token inválido', async () => {
    const token = 'invalidToken';

    const response = await chai.request(app)
      .get(prefix)
      .set('Authorization', `Bearer ${token}`);

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
  });
});
});