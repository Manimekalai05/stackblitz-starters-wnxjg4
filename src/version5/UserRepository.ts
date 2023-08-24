import Ticket from '../../Domain/Ticket';
import User from '../../Domain/User';
import { Reply } from '../model/Reply';
export interface UserRepository {
  getCurrentUser(): Promise<User>;
}
