import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  public static async findAllHome(req: Request, res: Response) {
    const result = await LeaderboardService.findAll();
    return res.status(200).json(result);
  }
}
