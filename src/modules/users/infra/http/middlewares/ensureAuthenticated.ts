import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  is_admin: boolean;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const cookie_token = request.cookies.token;

  if (!cookie_token) {
    throw new AppError('JWT token is missing', 404);
  }

  const { secret } = authConfig.jwt;

  if (!secret) {
    throw new AppError('Internal error. Unable to authenticate');
  }

  try {
    const decoded = verify(cookie_token, secret);
    const { sub, is_admin } = decoded as ITokenPayload;
    request.user = {
      id: sub,
      is_admin,
    };
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
