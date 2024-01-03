import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const LeaderboardRouter = Router();

LeaderboardRouter.get('/home', (req, res) => LeaderboardController.findAllHome(req, res));

export default LeaderboardRouter;
