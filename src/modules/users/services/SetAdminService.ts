import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  is_admin: boolean;
  user_id: string;
}

@injectable()
class SetAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ is_admin, user_id }: IRequest): Promise<User> {
    if (!is_admin) {
      throw new AppError('The user does not have permission for this action');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    user.is_admin = !user.is_admin;

    return this.usersRepository.save(user);
  }
}

export default SetAdminService;
