import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { App } from '../app';
const { app } = new App();
import { teams } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /teams', () => {
  beforeEach(async () => { sinon.restore() } );
  const prefix = '/teams';
  it('Deve retornar um array de equipes e status 200', async () => {
    // Faz uma requisição GET para a rota /teams
    const response = await chai.request(app)
    .get(prefix);

    // Verifica se o status de resposta é 200 e se retorna os teams
    expect(response).to.have.status(200);
    expect(response.body).to.be.deep.equal(teams)

  });
});
