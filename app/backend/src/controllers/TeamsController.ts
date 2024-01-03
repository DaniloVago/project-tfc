import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  constructor(
    private teamsService = new TeamsService(),
  ) { }

  async getTeams(_req: Request, res: Response) {
    const result = await this.teamsService.getTeams();
    const { status, data } = result;
    return res.status(status).json(data);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.teamsService.getById(Number(id));
    const { status, data } = result;
    return res.status(status).json(data);
  }
}
