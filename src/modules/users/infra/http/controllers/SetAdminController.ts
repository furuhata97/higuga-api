import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import SetAdminService from '@modules/users/services/SetAdminService';

export default class SetAdminController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { is_admin } = request.user;
    const { user_id } = request.body;

    const setAdmin = container.resolve(SetAdminService);

    const user = await setAdmin.execute({ is_admin, user_id });

    return response.json(classToClass(user));
  }
}
