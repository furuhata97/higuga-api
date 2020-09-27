import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';
import LogoutService from '@modules/users/services/LogoutService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token, refreshToken } = await createSession.execute({
      email,
      password,
    });

    response.cookie('token', token, { httpOnly: true, secure: true });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return response.json({ user: classToClass(user) });
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id, is_admin } = request.user;

    return response.json({ id, is_admin });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.cookies;

    const logout = container.resolve(LogoutService);

    await logout.execute({ refreshToken });

    response.clearCookie('token');
    response.clearCookie('refreshToken');
    response.clearCookie('_csrf');

    return response.status(200).json({ message: 'Logout successful' });
  }
}
