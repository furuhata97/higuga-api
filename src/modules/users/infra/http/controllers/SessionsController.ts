import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const { user, token } = await createSession.execute({
      email,
      password,
    });
    return response.json({ user: classToClass(user), token });
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id, is_admin } = request.user;

    return response.json({ id, is_admin });
  }
}
