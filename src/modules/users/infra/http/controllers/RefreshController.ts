import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import RefreshService from '../../../services/RefreshService';

export default class RefreshController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    const refresh = container.resolve(RefreshService);

    const { user, token } = await refresh.execute({
      id,
      refreshToken,
    });

    response.cookie('token', token, { httpOnly: true });

    return response.json({ user: classToClass(user) });
  }
}
