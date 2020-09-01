import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserService from './UpdateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    updateUser = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update info and password from a user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'John Deux',
      email: user.email,
      phone_number: user.phone_number,
      old_password: '123456',
      password: 'abc123',
    });

    expect(updatedUser).toHaveProperty('name', 'John Deux');
    expect(updatedUser).toHaveProperty('password', 'abc123');
  });

  it('should be able to update just info from a user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'John Deux',
      email: user.email,
      phone_number: user.phone_number,
    });

    expect(updatedUser).toHaveProperty('name', 'John Deux');
    expect(updatedUser).toHaveProperty('email', 'johndoe2@example.com');
  });

  it('should not be able to update password without old password', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Deux',
        email: user.email,
        phone_number: user.phone_number,
        password: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password when old password does not match', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'John Deux',
        email: user.email,
        phone_number: user.phone_number,
        old_password: '123789',
        password: '987654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update info without valid user id', async () => {
    await expect(
      updateUser.execute({
        user_id: 'fake-user-id',
        name: 'John Deux',
        email: 'email@a.com',
        phone_number: '998877665544',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to use an email from another use', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    const user2 = await createUser.execute({
      name: 'John Trois',
      email: 'johndoe2@example.com',
      password: '123456',
      zip_code: '86790000',
      city: 'Lobato',
      address: 'Rua A',
      phone_number: '44999999999',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.name,
        email: user2.email,
        phone_number: user.phone_number,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
