import { Router } from 'express';
import validateToken from '../middlewares/validateToken';
import MatchesController from '../controllers/MatchesController';

const matchesRouter = Router();

const matchesController = new MatchesController();

matchesRouter.get('/', (req, res) => matchesController.getMatches(req, res));
matchesRouter.patch(
  '/:id/finish',
  validateToken,
  (req, res) => matchesController.finishMatches(req, res),
);
matchesRouter.patch(
  '/:id',
  validateToken,
  (req, res) => matchesController.updateMatches(req, res),
);
matchesRouter.post(
  '/',
  validateToken,
  (req, res) => matchesController.postMatches(req, res),
);

export default matchesRouter;
