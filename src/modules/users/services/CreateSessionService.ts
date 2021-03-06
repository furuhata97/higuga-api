import { injectable, inject } from 'tsyringe';
import { uuid } from 'uuidv4';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password', 401);
    }

    if (!authConfig.jwt?.secret) {
      throw new AppError('Internal error. Unable to authenticate', 500);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ is_admin: user.is_admin }, secret, {
      subject: user.id,
      expiresIn,
    });

    const refreshToken = uuid();

    const cacheKey = `refresh-token:${refreshToken}`;
    await this.cacheProvider.save(
      cacheKey,
      JSON.stringify({ token, refreshToken, user_id: user.id }),
    );

    const addresses = user.addresses.sort((a, b) => {
      return +new Date(a.created_at) - +new Date(b.created_at);
    });

    user.addresses = addresses;

    return {
      user,
      token,
      refreshToken,
    };
  }
}

export default AuthenticateUserService;
