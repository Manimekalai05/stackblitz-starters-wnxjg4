import { Reply } from '../model/Reply';

export interface UserServiceBoundary {
  isModerator(ReplyInput: Reply): Promise<boolean>;
}
