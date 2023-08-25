import User from '../../../../User/domain/User';
import { Reply } from '../../model/Reply';
import { UserRepository } from '../../repository/UserRepository';

export class ForumPermissionUsecase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(replyInput: Reply): Promise<boolean> {
    const user = await this.userRepo.getCurrentUser();

    return getUserValidation(user);
  }
}

const getUserValidation = (user: User) => {
  if (user.isforumPermission()) {
    throw new Error('faliure');
  }
  return true;
};
