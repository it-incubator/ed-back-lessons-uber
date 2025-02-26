import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types/http-statuses';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'qwerty';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== 'Basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    next(); // Успешная авторизация, продолжаем
    return;
  }

  res.sendStatus(HttpStatus.Unauthorized);
  return;
};
