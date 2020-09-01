import { DeleteResult } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IAddAddressDTO from '../dtos/IAddAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  addAddress(data: IAddAddressDTO): Promise<Address>;
  findAddressById(id: string): Promise<Address | undefined>;
  updateAddress(address: Address): Promise<Address>;
  deleteAddress(id: string): Promise<DeleteResult>;
}
