// import * as chai from 'chai';
// import * as sinon from 'sinon';
// // @ts-ignore
// import chaiHttp = require('chai-http');
// import { describe, it, beforeEach } from 'mocha';
// import { App } from '../app';
// import LeaderboardService from '../services/LeaderboardService';
// import { leaderboardMock } from '../tests/mocks/leaderboard.mock'

// chai.use(chaiHttp);
// const { expect } = chai;

// describe('Testes da rota /leaderboard', () => {
//     beforeEach(() => {
//       sinon.restore();
//     });
  
//     const { app } = new App(); 
  
//     it('Deve retornar a tabela de leaderboard ordenada corretamente', async () => {
//       const response = await chai.request(app)
//         .get('/leaderboard/home');
  
//       expect(response).to.have.status(200);
//       expect(response.body).to.deep.equal([
//         expect(response.body).to.deep.equal(leaderboardMock)
//       ]);
//     });
//   });
  
