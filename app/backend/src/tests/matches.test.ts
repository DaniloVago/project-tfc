import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe, it, beforeEach } from 'mocha';
import { App } from '../app';
import { allMatches, inProgressMatches, matchPayload, validAuthorization, validMatchId } from './mocks/matches.mock';
import MatchesService from '../services/MatchesService';
import TeamsService from '../services/TeamsService';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testes dos endpoints /matches/:id/finish e /matches/:id', () => {
  beforeEach(() => {
    sinon.restore();
  });

  const { app } = new App();

  const matchesServiceStub = sinon.createStubInstance(MatchesService);
  matchesServiceStub.finishMatches.resolves({ status: 200, data: { message: 'Finalizado' } });
  matchesServiceStub.updateMatches.resolves({ status: 200, data: { message: 'Score Updated' } });
  matchesServiceStub.getMatches.resolves({ status: 200, data: allMatches });
  matchesServiceStub.getMatchesWithProgress.resolves({ status: 200, data: inProgressMatches });

  it('Deve finalizar uma partida em andamento e retornar status 200 com mensagem "Finished"', async () => {
    const response = await chai.request(app)
      .patch(`/matches/${validMatchId}/finish`)
      .set('Authorization', validAuthorization);

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ message: 'Finished' });
  });

  it('Deve atualizar o resultado de uma partida e retornar status 200 com mensagem "Score Updated"', async () => {

    const response = await chai.request(app)
      .patch(`/matches/${validMatchId}`)
      .set('Authorization', validAuthorization)
      .send(matchPayload);

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ message: 'Score Updated' });
  });

  it('Deve obter todas as partidas e retornar status 200', async () => {
    const response = await chai.request(app)
      .get('/matches');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(allMatches);
  });

  it('Deve obter partidas em andamento e retornar status 200', async () => {
    const response = await chai.request(app)
      .get('/matches')
      .query({ inProgress: 'true' });

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(inProgressMatches);
  });
});



