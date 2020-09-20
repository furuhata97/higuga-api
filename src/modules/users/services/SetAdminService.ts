import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
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

    @inject('MailProvider')
    private mailProvider: IMailProvider,
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

    const savedUser = await this.usersRepository.save(user);

    const setAdminTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'set_admin.hbs',
    );

    if (savedUser.is_admin) {
      await this.mailProvider.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[Higuga] Privilégio de Administrador',
        templateData: {
          file: setAdminTemplate,
          variables: {
            name: user.name,
          },
        },
      });
    }

    return savedUser;
  }
}

export default SetAdminService;
