import { Router } from 'express';
import validateLogin from '../middlewares/validateLogin';
import validateToken from '../middlewares/validateToken';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

const loginController = new LoginController();

loginRouter.post('/', validateLogin, (req, res) => loginController.login(req, res));
loginRouter.get('/role', validateToken, (req, res) => loginController.getRole(req, res));

export default loginRouter;
