import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const jwtOptions: jwt.SignOptions = {
  expiresIn: '14d',
};

const sign = (email: string): string => {
  const token = jwt.sign({ email }, JWT_SECRET, jwtOptions);
  return token;
};

const verify = (token: string): jwt.JwtPayload | false => {
  try {
    const verifyToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return verifyToken;
  } catch (error) {
    return false;
  }
};

export default {
  sign,
  verify,
};
