import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(
    private matchesService = new MatchesService(),
  ) { }

  async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (!inProgress) {
      const result = await this.matchesService.getMatches();
      const { status, data } = result;
      return res.status(status).json(data);
    }

    const inProgressBool = inProgress === 'true';

    const result = await this.matchesService.getMatchesWithProgress(inProgressBool);
    const { status, data } = result;
    return res.status(status).json(data);
  }

  async finishMatches(req: Request, res: Response) {
    const { id } = req.params;
    const matchId = parseInt(id, 10); // converte id para number
    const result = await this.matchesService.finishMatches(matchId);
    const { status, data } = result;
    return res.status(status).json(data);
  }

  async updateMatches(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const matchId = parseInt(id, 10); // converte id para number
    const result = await this.matchesService.updateMatches(matchId, homeTeamGoals, awayTeamGoals);
    const { status, data } = result;
    return res.status(status).json(data);
  }

  async postMatches(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    const result = await this.matchesService
      .postMatches(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);
    const { status, data } = result;
    return res.status(status).json(data);
  }
}
