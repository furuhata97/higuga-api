import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { DeleteResult } from 'typeorm';
import Address from '../infra/typeorm/entities/Address';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  address_id: string;
}

@injectable()
class DeleteAddressService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    address_id,
  }: IRequest): Promise<DeleteResult> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const updateAddress = user.addresses.find(a => a.id === address_id);

    if (!updateAddress) {
      throw new AppError('Address not found');
    }

    return this.usersRepository.deleteAddress(address_id);
  }
}

export default DeleteAddressService;
