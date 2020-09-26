import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  refreshToken: string;
}

@injectable()
class LogoutService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ refreshToken }: IRequest): Promise<void> {
    if (!refreshToken) {
      throw new AppError('No refreshToken found', 404);
    }

    await this.cacheProvider.invalidate(`refresh-token:${refreshToken}`);
  }
}

export default LogoutService;
