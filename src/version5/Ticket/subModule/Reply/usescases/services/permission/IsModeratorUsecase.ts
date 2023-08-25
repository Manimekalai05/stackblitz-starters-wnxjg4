import { Reply } from '../../model/Reply';
import { DraftRepository } from '../../repository/DraftRepository';
import NotificationBoundary from '../../repository/NotificationBoundary';
import { UserRepository } from '../../repository/UserRepository';

export class IsModeratorUsecase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(replyInput: Reply): Promise<boolean> {
    const user = await this.userRepo.getCurrentUser();
    return user.isModerator();
  }
}
