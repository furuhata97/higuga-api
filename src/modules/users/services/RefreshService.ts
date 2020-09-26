import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  id: string;
  refreshToken: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class RefreshService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ id, refreshToken }: IRequest): Promise<IResponse> {
    const token = await this.cacheProvider.recover<string>(
      `refresh-token:${refreshToken}`,
    );

    if (!token) {
      throw new AppError('Unauthorized refresh token', 404);
    }

    const parsedToken = JSON.parse(token);

    if (parsedToken.user_id === id) {
      const user = await this.usersRepository.findById(id);

      if (!user) {
        throw new AppError('The provided id does not match token', 404);
      }

      if (!authConfig.jwt?.secret) {
        throw new AppError('Internal error. Unable to authenticate', 500);
      }

      const { secret, expiresIn } = authConfig.jwt;

      const newToken = sign({ is_admin: user.is_admin }, secret, {
        subject: user.id,
        expiresIn,
      });

      await this.cacheProvider.save(
        `refresh-token:${refreshToken}`,
        JSON.stringify({
          token: newToken,
          refreshToken,
          user_id: user.id,
        }),
      );

      return {
        token: newToken,
        user,
      };
    }

    throw new AppError('Unauthorized refresh token', 404);
  }
}

export default RefreshService;
