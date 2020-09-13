import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetUsersService from '@modules/users/services/GetUsersService';

export default class AllUsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { is_admin } = request.user;

    const getAllUsers = container.resolve(GetUsersService);

    const users = await getAllUsers.execute(is_admin);

    return response.json(classToClass(users));
  }
}
