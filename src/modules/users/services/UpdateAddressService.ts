import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Address from '../infra/typeorm/entities/Address';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  address_id: string;
  zip_code: string;
  city: string;
  address: string;
}

@injectable()
class UpdateAddressService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    address_id,
    zip_code,
    city,
    address,
  }: IRequest): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const updateAddress = user.addresses.find(a => a.id === address_id);

    if (!updateAddress) {
      throw new AppError('Address not found');
    }

    updateAddress.zip_code = zip_code;
    updateAddress.city = city;
    updateAddress.address = address;

    return this.usersRepository.updateAddress(updateAddress);
  }
}

export default UpdateAddressService;
