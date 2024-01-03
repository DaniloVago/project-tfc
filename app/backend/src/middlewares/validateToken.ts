import { Request, Response, NextFunction } from 'express';
import jwtUtils from '../utils/jwtUtils';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const token = authorization.split(' ')[1];
  const decodedToken = jwtUtils.verify(token);
  if (!decodedToken) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  next();
};

export default validateToken;
