import { UserRepository } from '../../User/usecases/repository/UserRepository';
import Ticket from '../Domain/Ticket';
import { Reply } from '../usescases/model/Reply';
import { DraftRepository } from '../usescases/repository/DraftRepository';
import ApiReply from './Http/ApiReply';

class UserResource implements UserRepository {
  constructor(
    private readonly store:
  ) {}
  async getCurrentUser(): Promise<User> {
    return this.store.getState().user;  /* just for now */
  }
}

export default ReplyActionResource;
