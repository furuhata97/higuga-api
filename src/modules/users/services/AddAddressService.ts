import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import Address from '../infra/typeorm/entities/Address';

interface IRequest {
  user_id: string;
  zip_code: string;
  city: string;
  address: string;
}

@injectable()
class AddAddressService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    zip_code,
    city,
    address,
  }: IRequest): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return this.usersRepository.addAddress({
      user_id,
      zip_code,
      city,
      address,
    });
  }
}

export default AddAddressService;
