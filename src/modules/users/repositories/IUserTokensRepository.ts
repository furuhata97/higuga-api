import { DeleteResult } from 'typeorm';
import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  delete(token: string): Promise<DeleteResult>;
}
