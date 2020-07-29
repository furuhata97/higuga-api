import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    expect(user).toHaveProperty('id');
  });

  it('shouldn`t be able to create a new user with a already registered email', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        zip_code: '86790000',
        city: 'Lobato',
        address: 'Rua A',
        phone_number: '44999999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
