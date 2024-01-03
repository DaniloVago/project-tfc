import { Request, Response, NextFunction } from 'express';
import ILogin from '../Interfaces/ILogin';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as ILogin;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (password.length < 6) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  next();
};

export default validateLogin;
