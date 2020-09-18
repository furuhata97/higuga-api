import { getRepository, Repository, DeleteResult } from 'typeorm';
import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IAddAddressDTO from '@modules/users/dtos/IAddAddressDTO';
import User from '../entities/User';
import Address from '../entities/Address';

class UsersRepository implements IUsersRepository {
  private ormUserRepository: Repository<User>;

  private ormAddressRepository: Repository<Address>;

  constructor() {
    this.ormUserRepository = getRepository(User);
    this.ormAddressRepository = getRepository(Address);
  }

  public async create({
    name,
    email,
    phone_number,
    is_admin,
    password,
    zip_code,
    city,
    address,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormUserRepository.create({
      name,
      email,
      phone_number,
      is_admin,
      password,
      addresses: [{ zip_code, city, address, is_main: true }],
    });

    await this.ormUserRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormUserRepository.save(user);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormUserRepository.findOne({ where: { email } });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormUserRepository.findOne(id);

    return user;
  }

  public async addAddress({
    user_id,
    zip_code,
    city,
    address,
  }: IAddAddressDTO): Promise<Address> {
    const newAddress = this.ormAddressRepository.create({
      id: uuid(),
      user_id,
      zip_code,
      city,
      address,
      is_main: false,
    });

    await this.ormAddressRepository.save(newAddress);

    return newAddress;
  }

  public async findAddressById(id: string): Promise<Address | undefined> {
    return this.ormAddressRepository.findOne(id);
  }

  public async updateAddress(address: Address): Promise<Address> {
    return this.ormAddressRepository.save(address);
  }

  public async deleteAddress(id: string): Promise<DeleteResult> {
    const result = await this.ormAddressRepository.delete(id);
    return result;
  }

  public async findAllUsers(): Promise<User[]> {
    const users = await this.ormUserRepository.find();

    return users;
  }
}

export default UsersRepository;
