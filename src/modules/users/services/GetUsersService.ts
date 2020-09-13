import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(is_admin: boolean): Promise<User[]> {
    if (!is_admin) {
      throw new AppError('The user does not have permission for this action');
    }

    const users = await this.usersRepository.findAllUsers();

    return users;
  }
}

export default GetUsersService;
